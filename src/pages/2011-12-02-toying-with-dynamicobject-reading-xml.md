---
title: "Toying with DynamicObject: Reading XML"
date: 2011-12-02
---

I’ve always been interested in using language tools in ways that can foster communication. One such tool which I’ve been looking for excuses to apply at work has been Dynamic Objects. [DynamicObject](http://msdn.microsoft.com/en-us/library/system.dynamic.dynamicobject.aspx) is a class introduced in .Net 4.0 that lets you specify dynamic behavior for run-time.

#### Communication in .Net 4

The new dynamic features adds a lot of behavior to C# which I’d previously looked to languages like [Boo](http://boo.codehaus.org/) for. I’ll get into some of the pros and cons that go along with this style in a moment. First, let’s look at some XML.

```xml
<?xml version="1.0" encoding="utf-8" ?>
<file>
  <header>
    <title>Welcome</title>
  </header>
  <message>
    <body>
      Hello, World!
    </body>
    <parameter>Param1</parameter>
    <parameter>Param2</parameter>
    <parameter>Param3</parameter>
  </message>
</file>
```

This is not a very sophisticated document. If it looks like I threw it together in a minute, well, that is precisely what I did! We can assume this is not an XML document which is going to see a lot of future development added around it in the future, but I can still achieve expressive code and minimal syntax in C# using dynamics.

#### Exploring DynamicObject

The syntax I want is to access the elements of the document as properties but without making it strongly typed. For instance,

```cs
var body = file.message.body;
```

I can derive DynamicObject and override the TryGetMember (which is called when the dynamic object tries to access a property) so that it looks at the XElement’s descendants for elements with a matching name. The first thing I need to do is create the dynamic object using an XElement as the source.

```cs
/// <summary>
/// A class for processing XML nodes using dynamics.
/// </summary>
public class DynamicXElement : DynamicObject
{
    #region Constructor

    public DynamicXElement(XElement element)
    {
        this.element = element;
    }

    #endregion

    #region Fields

    private readonly XElement element;

    #endregion
```

I simply use the constructor to feed an XElement to my dynamic object. Afterwards, I need to override TryGetMember to implement the custom behavior.

```cs
    #region Overrides

    public override bool TryGetMember(GetMemberBinder binder, out object result)
    {
        var elements = this.element.Descendants(binder.Name);
        int count = elements.Count();

        if (count == 0)
        {
            result = this.GetElementMember(binder.Name);
            return true;
        }

        if (count == 1)
        {
            result = new DynamicXElement(elements.First());
            return true;
        }

        result = new List<DynamicXElement>(elements.Select(x => new DynamicXElement(x)));
        return true;
    }

    /// <summary>
    /// For clarity when working with the element.
    /// </summary>
    public override string ToString()
    {
        return this.element.ToString();
    }

    #endregion
```

Two things I want to note: if zero elements are returned I try to resolve the property by calling a member on the XElement object itself (will show that code in a moment) and if more than one element is returned then I copy everything over to a new list of dynamic elements. When resolving a property to the XElement class, I knew that I could use Reflection to get the member and invoke it, but I preferred to explore the technique while sticking with the runtime binding features introduced in .Net 4.0. Instead of invoking a member, the runtime binder is more about targeting a call site.

```cs
    /// <summary>
    /// If a member isn't a descendant of the node, we can attempt to find
    /// a member with the same name on the underlying XElement element.
    /// </summary>
    private object GetElementMember(string memberName)
    {
        var elementBinder =
            Binder.GetMember(
                CSharpBinderFlags.None,
                memberName,
                typeof(XElement),
                new[] { CSharpArgumentInfo.Create(CSharpArgumentInfoFlags.None, null) });

        var callsite = CallSite<Func<CallSite, XElement, object>>.Create(elementBinder);
        return callsite.Target(callsite, this.element);
    }
```

Harnessing code like this, we’ve definitely peeled back the cover of how the runtime binder operates, but I would avoid dipping into this class too often. It’s not intended for application code and may be more susceptible to breaking changes with new releases as a result.

#### Reading the XML Document with Dynamics

The `DynamicXElement` class is written, but what has it achieved? It doesn’t do anything we couldn’t already do with XElement, but from the application code perspective, the syntax is much cleaner. However, we’ve lost the compile-time checking we would have had if we had generated an XSD and a class for the document.

Enough of the `DynamicXElement` class has been written to allow us to read data out of the file. The following sample demonstrates the usage:

```cs
    class Program
    {
        static void Main()
        {
            var doc = XDocument.Load("Sample.xml");
            dynamic file = new DynamicXElement(doc.Root);

            Console.WriteLine("ToString():");
            Console.WriteLine(file.ToString());

            Console.WriteLine("Title:");
            Console.WriteLine(file.header.title.Value);

            Console.WriteLine("Body:");
            Console.WriteLine(file.message.body.Value);

            Console.WriteLine("Parameters:");
            Console.WriteLine(file.message.parameter.Count);

            foreach (dynamic parameter in file.message.parameter)
                Console.WriteLine(parameter.Value);

            Console.Read();
        }
    }
```

When executed, the program returns the following console output:

```
ToString():
<file>
  <header>
    <title>Welcome</title>
  </header>
  <message>
    <body>
      Hello, World!
    </body>
    <parameter>Param1</parameter>
    <parameter>Param2</parameter>
    <parameter>Param3</parameter>
  </message>
</file>
Title:
Welcome
Body:

      Hello, World!

Parameters:
3
Param1
Param2
Param3
```

In closing, I could see myself using something like this on the job if I had to parse an XML response from a web service with an inconsistent, noisy, or poorly defined schema. Especially if I had several web methods to call and each one had a unique schema for every request, response, and/or possible error messages. JSON web services, in particular, tend to evolve the response based on how you format the request. Dynamics are a cool concept, but they haven’t revolutionized the way I code yet.

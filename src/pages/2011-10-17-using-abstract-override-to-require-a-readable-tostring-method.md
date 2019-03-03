---
title: "Using Abstract Override to require a readable ToString Method"
description: "Are you tired of all of your objects being named simply "Object"? You can make ToString() an abstract override method in your abstract class in order to force implementation classes to always provider an implementation for logging purposes."
date: 2011-10-17
---

If you have a type that you know is going to show up in a log file, an easy way to ensure the instance will produce useful output to the logs is to override `ToString()` and put the results in the log. But what if you’re responsible for the base class and someone else may be writing the implementation? You can’t force them to override ToString(), can you?

```cs
public abstract class Customer : ICustomer
{
    public abstract override string ToString();
}

public class Person : Customer
{
    public string FirstName { get; set; }
    public string LastName { get; set; }

    public override string ToString()
    {
        return LastName + ", " + FirstName;
    }
}

public class Organization : Customer
{
    public string Name { get; set; }
    public bool IsNonProfit { get; set; }

    public override string ToString()
    {
        string organizationType = IsNonProfit ? "non-profit" : "for profit";
        return Name + ", a " + organizationType + " organization";
    }
}
```

What I like about this solution is that the code communicates the message: disregard the default implementation of ToString() and require that the concrete class implement it again. You must name your object instances. In the past, I have created a separate abstract property in my classes to give it a name; such as OperationName, TransactionName, ContactName, etc. I didn’t realize at the time but I was just giving my classes two ways to say the same thing and they weren’t always in tune with each other.

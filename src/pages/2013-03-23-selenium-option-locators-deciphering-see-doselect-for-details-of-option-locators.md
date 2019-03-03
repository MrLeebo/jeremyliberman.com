---
title: "Selenium Option Locators: Deciphering “@see #doSelect for details of option locators”"
description: "I take a look into Selenium's source code to resolve a confusing error message and find a workaround for selecting all of the options in a multi-select dropdown control."
date: 2013-03-23
---

I like [Selenium][selenium]. It makes it really easy to bring automated web testing to the masses. But their documentation practices can be frustrating. I want to talk about a feature called **Option Locators** not because there is anything particularly sexy about them, but because I had such a hard time figuring out what they are.

But just in case I’m getting ahead of myself, let me start over by introducing the tool I’m talking about.

#### Selenium: Automating Web Browsers

If you do a lot of web development, this is a great tool to put in your toolbox. It is a web browser automation tool and what makes it really stand out for me is how easy it is to rapidly develop an automation macro (using a simple record and playback interface) and then export the script into a whole slew of other languages including Ruby, PHP, Java, or C#.

Imagine receiving a Selenium macro as an attachment to a bug report. You use the macro to resolve the issue and verify it’s been fixed, then you can save the macro away in your repository to test for possible regressions later. This can become the foundation for a fully featured automated testing system when you’re ready to make the leap to [Selenium WebDriver][web-driver].

#### Option Locators

Yesterday I was putting together a macro to populate a form that I had to repeatedly fill out as part of an issue I was working on. One of the steps was to select all of the option elements inside a select element called “ddlGeographyValue”. Now, as I’ve mentioned, you can create these macros using a record-and-playback style IDE, but unfortunately it takes a rather literal interpretation of this command.

<img src="/assets/selenium-ide.png" alt="Selenium IDE Screenshot">

It creates an individual addSelection command for each option. This wasn’t really what I wanted, not that it mattered much for a one-off throwaway script, but some of the selections were nested, so a static macro wasn’t going to do a lot of good. I was also curious if there was a way to make the addSelection command choose every option without coding them all in. Luckily the Selenium IDE comes with a built-in command reference, visible in the bottom of the image.

```
addSelection ( locator,optionLocator )
Arguments:
locator - an element locator identifying a multi-select box
optionLocator - an option locator (a label by default)
Add a selection to the set of selected options in a multi-select element using an option locator. @see #doSelect for details of option locators
```

From the IDE, the value of the Target column becomes the locator, and the Value column is the optionLocator. The documentation mentions that the default locator is label, but what other choices are there? Take note of `@see #doSelect for details of option locators` because that was the first thing I pasted into Google when I wanted to see what other option locators were available.

Your results may vary (they should include this post) but when I submitted that search to Google, every result for at least the first 4 pages was just a repeat of the command reference text, which has apparently been screen scraped by **all of the internet**.

Seriously? Where are you, #doSelect?

From Stack Overflow I got some partial answers on other option locators, but it was clear if I wanted a complete listing, I would need to go to the source. Source code, that is!

In case you’re wondering, the source code is available [here](http://code.google.com/p/selenium/source/browse/javascript/selenium-core/scripts/selenium-api.js).

Here’s the source code for the addSelection command:

```
Selenium.prototype.doAddSelection = function(locator, optionLocator) {
/**
* Add a selection to the set of selected options in a multi-select element using an option locator.
*
* @see #doSelect for details of option locators
*
* @param locator an element locator identifying a multi-select box
* @param optionLocator an option locator (a label by default)
*/
var element = this.browserbot.findElement(locator);
if (!("options" in element)) {
throw new SeleniumError("Specified element is not a Select (has no options)");
}
var locator = this.optionLocatorFactory.fromLocatorString(optionLocator);
var option = locator.findOption(element);
this.browserbot.addSelection(element, option);
};
```

And this brings us to our first real clue about what the optionLocator is. That would be whatever optionLocatorFactory makes it. Let’s look-up that next.

```
/**
* Factory for creating "Option Locators".
* An OptionLocator is an object for dealing with Select options (e.g. for
* finding a specified option, or asserting that the selected option of
* Select element matches some condition.
* The type of locator returned by the factory depends on the locator string:
* label=<exp> (OptionLocatorByLabel)
* value=<exp> (OptionLocatorByValue)
* index=<exp> (OptionLocatorByIndex)
* id=<exp> (OptionLocatorById)
* <exp> (default is OptionLocatorByLabel).
*/
function OptionLocatorFactory() {
}
```

And there we have it. I’m not going to post the factory functions, this comment gives you a pretty good idea what those are going to look like. Now why is a hopeful comment like this hidden back here in the source and not made available through the command reference in the Selenium IDE?

The irony is that those are precisely the locators I would have expected to support. OK, I probably wouldn’t have guessed “id” because I rarely give my options ids individually, but the rest were fairly obvious now that I know what they are! So why was I looking this up again?

#### Selecting All option elements using a Selenium macro

It turns out, none of these `optionLocators` allow you to define an `addSelection` command that selects more than one option at a time. I ended up using a separate command, `getEval(script)` to select the options. Now, getEval is actually hidden from the command drop down list in the Selenium IDE, the only reason I thought to use it was because it’s mentioned in the reference text for the command `verifyEval` which is listed.

`getEval` lets you run a snippet of javascript during your macro, which gives you an incredible amount of flexibility for performing actions that aren’t supported by the IDE. Here’s what I wrote to select all of the options elements for the ddlGeographyValues select element.

```
Command: getEval
Target: window.$("#ddlGeographyValue option").attr('selected','selected')
Value: (Empty)
```

That’s all I’ve got. If you made it this far, thanks for reading!

[selenium]: http://docs.seleniumhq.org
[web-driver]: http://docs.seleniumhq.org:80/docs/03_webdriver.jsp

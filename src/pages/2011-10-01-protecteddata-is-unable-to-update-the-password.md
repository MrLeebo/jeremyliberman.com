---
title: "ProtectedData is unable to update the password?"
date: 2011-10-01
---

Perhaps you’ve used the `System.Security.Cryptography.ProtectedData` class before. Perhaps you’ve encountered this diabolical little error message before:

```
Unable to update the password. The value provided for the new password does not meet the length,
complexity, or history requirement of the domain.
```

Per its [documentation](http://msdn.microsoft.com/en-us/library/system.security.cryptography.protecteddata.aspx), the ProtectedData class seemed like a nice lightweight wrapper around the `CyptProtectData` and `CryptUnprotectData`
functions in the [Crypt32](http://msdn.microsoft.com/en-us/library/aa380252%28v=VS.85%29.aspx#data_encryption_and_decryption_functions) library. You can encrypt and decrypt sensitive information and lock access down to a specific user account or server. The decryption code was quite simple, looking more or less like so:

```cs
// Pull from the database table the
// row with a matching server name and
// where the current date is within the
// effective range defined by BeginDate
// and EndDate.
byte[] keyData= ...

// Some application-specific salt.
byte[] entropy = Encoding.UTF8.GetBytes("Cl4Rk-k3N7");

// Give me my sensitive information please!
return ProtectedData.Unprotect(keyData, entropy, DataProtectionScope.LocalMachine);
```

I didn’t need anything fancy, just a way to keep some sensitive server-and-application-specific information stored in a database table like this:

<table>
    <thead>
        <tr>
            <th>KeyData (as varbinary)</th><th>ServerName</th><th>BeginDate</th><th>EndDate</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>0x00000123456789</td><td>Smallville</td><td>10/1/2011</td><td>NULL</td>
        </tr>
    </tbody>
</table>

And it worked! ProtectedData seemed simpler and more reliable than my experience with the [RSACryptoServiceProvider](http://msdn.microsoft.com/en-us/library/system.security.cryptography.rsacryptoserviceprovider.aspx) class, but I’ll save that experience for another post.

#### The secret flag

The application worked perfectly well on my local machine and tested in the development environment. Several days passed and I got busy working on other projects. Then I get an email after the application generated this error message when it went to the QA environment:

```
CryptographicException
System.Security.Cryptography.ProtectedData.Unprotect
Unable to update the password. The value provided for the new password does not meet the length,
complexity, or history requirement of the domain.
```

I may be new to the ways of information cryptography, but even I know that the `ProtectedData.Unprotect` method has nothing to do with changing a user’s password. The error might even seem halfway plausible if I had been using `DataProtectionScope.CurrentUser`, but even then it doesn’t make any kind of sense. Examining the source code, I detected this interesting morsel:

```c
uint dwFlags = CAPI.CRYPTPROTECT_UI_FORBIDDEN;
if (scope == DataProtectionScope.LocalMachine)
    dwFlags |= CAPI.CRYPTPROTECT_LOCAL_MACHINE;
```

The LocalMachine flag, I understand. But what about this “CRYPTPROTECT_UI_FORBIDDEN” flag? What does that do? Why is it true in all cases? Consulting the [documentation](http://msdn.microsoft.com/en-us/library/ms995355.aspx#windataprotection-dpapi_topic02) revealed the following information (towards the middle of the page):

```
CRYPTPROTECT_UI_FORBIDDEN
This flag is used for remote situations where presenting a user interface (UI) is not an option. When this flag is set and a UI is specified for either protection or unprotection, the call fails and GetLastError() returns the ERROR_PASSWORD_RESTRICTION status code.
```

Returns `ERROR_PASSWORD_RESTRICTION`, eh? Sounds familiar. I’ll bet that’s the source of the exception. But why would the DPAPI even try to present a UI?

#### Enter the PromptStruct

A little further down the page, under the `CRYPTPROTECT_PROMPTSTRUCT` heading lies the sole explanation I could find after several hours of Google searches. The ProtectedData class is merely a wrapper for the Crypt32 library and not all of the features of the library are available in the wrapper.

One of these features is the PromptStruct, a definition for a windows forms prompt that will appear on screen when the user tries to encrypt or decrypt data.

The source code for the ProtectedData class always passes in IntPtr.Zero for the value of the PromptStruct. I couldn’t understand how, if the DPAPI had been accessed solely via the ProtectedData class, a value other than IntPtr.Zero could have been passed in for the PromptStruct during the encryption. This puzzle left me stumped for hours. I stayed late at the office. I struggled over it after dinner. Later, I got an email from a member of the SysOps team. At least I wasn’t the only person looking into this. Maybe she had enjoyed better luck?

#### The Prestige

Turns out during the deployment, she had typed the command in the command line to run the application that would encrypt the data, but never hit the enter key to execute the command. Because the data had never been encrypted by the ProtectedData.Protect method (which passes IntPtr.Zero as the PromptStruct), the default value for the prompt structure was used. That just so happens to be a Medium security structure. The DPAPI believe that the data (which didn’t exist) had been encrypted with medium security and that the application was trying to decrypt it using no security whatsoever. Following the breadcrumbs back towards my code, the “always-true-for-ProtectedData API-calls” flag CRYPTPROTECT_UI_FORBIDDEN returned the ERROR_PASSWORD_RESTRICTION status code as the description had promised. That status code in turn was transformed into the not-at-all helpful exception message regarding changing of passwords. Mystery solved.

Moral of the story?

Before you can Unprotect, you must learn to Protect. Stick that on a fortune cookie.

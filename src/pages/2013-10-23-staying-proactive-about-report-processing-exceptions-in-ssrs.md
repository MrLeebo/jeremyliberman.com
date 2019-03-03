---
title: "Receiving Email Notifications for Report Processing Exceptions in SSRS"
description: "SSRS reports do not make it easy for developers to detect and log runtime errors, so I wrote a PowerShell script to notify myself when they occur."
date: 2013-10-23
---

Seeing this error crop up in place of a graph or chart in an SSRS report always irked me.

```
Error: Subreport could not be shown
```

It means there is a problem, but it’s been swept under the rug. The calling application can’t process the error, because SSRS already has. It makes a note and replaces the report with a plain text label. And until recently, as the developer I wouldn’t know anything was wrong, because that same rug-sweep prevented anything amiss from showing up in the application’s logging system.

While going over the logs to find the source of an issue I was investigating, I noticed several other report processing errors that were unreported. I want to be proactive on issues where reports are broken, even if nobody reports a problem.

In SSRS, the **Service Trace Log** is the most complete source of information about errors running reports. I wanted to receive an **email notification** any time an error was logged by the Service Trace Log.

It seemed like a common enough request, and I was surprised to see no notes about setting up email notifications in the documentation for SSRS. In fact, the Microsoft recommendation is to just [read the logs using a text editor][service-trace-log], preferably before they expire in 14 days (default configuration).

There might be existing solutions that do something like this already, and there are a lot of improvements that can still be made, but my simple solution was to write a **PowerShell Script** that would watch the most recent SSRS Log File and generate an email when it found the text “ERROR:”. That script looks a bit like this:

```powershell
$dir = 'C:\Program Files\Microsoft SQL Server\MSSQLSERVER\Reporting Services\LogFiles\';

$logFile = ls $dir | sort LastWriteTime | select -last 1

cat $logFile.FullName -Wait | where {$_ -match "ERROR:"} | % {

  Send-MailMessage `
    -To 'myemail@company.com' `
    -From 'donotreply@company.com' `
    -Subject 'SSRS ERROR in Trace Log' `
    -Body "An error was detected in the SSRS Trace Log $($logFile.FullName): $_" `
    -SmtpServer 'localhost';

}
```

A few things of note: SSRS’ LogFiles are timestamped and a new one is created in 24 hours or when the last one gets too large. This means the script will eventually start watching the wrong file after SSRS has started the next one. Luckily for me, the log files on our servers tend to get replaced only once each day at around 10:00 PM, which is outside office hours so nobody is running reports.

At 4:00 AM I have a Windows Scheduled Task that refreshes the script, or starts it if for whatever reason it stopped running.

The “-Wait” switch on `Get-Content` (PowerShell Alias: cat) is a cheap way to get a `tail -f` style log watcher in a PowerShell script.

[service-trace-log]: https://docs.microsoft.com/en-us/sql/reporting-services/report-server/report-server-service-trace-log?view=sql-server-2017

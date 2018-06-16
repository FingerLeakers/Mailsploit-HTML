**TL;DR:** Mailsploit is a collection of bugs in email clients that allow effective sender spoofing and code injection attacks. The spoofing is not detected by Mail Transfer Agents (MTA) aka email servers, therefore circumventing spoofing protection mechanisms such as DMARC (DKIM/SPF) or spam filters.

Bugs were found in over **[30 applications](https://docs.google.com/spreadsheets/d/1jkb_ZybbAoUA43K902lL-sB7c1HMQ78-fhQ8nowJCQk)**, including prominent ones like Apple Mail (macOS, iOS and watchOS), Mozilla Thunderbird, various Microsoft email clients, Yahoo! Mail, ProtonMail and others.

In addition to the spoofing vulnerability, some of the tested applications also proved to be vulnerable to **XSS and code injection attacks**.
## Background

Email identities were really easy to spoof back in the 90s and early 2000s. Changing the “From” header field was enough to make friends believe an email came from their mother, significant other, or even the FBI. There were websites specially made for this purpose.

However, those tricks no longer work thanks to anti-spoofing protections such as DMARC (DKIM / SPF) and anti-spam filters. Today, emails with a spoofed “From” field either go to the spam folder or are completely rejected by the server.

Email usage is higher than ever and email is used for everything – from tracking parcels to sharing sensitive data. Unfortunately email is already not a very secure way to communicate.

We’ve seen a lot of malware spreading via emails, relying on social engineering techniques to convince users to open unsafe attachments, or click on phishing links. The rise of ransomware distributed over email clearly demonstrates the effectivity of those mechanisms.

What if there was a way to bypass DMARC protection and spoof the sender name like it was 1999? *Guess what, there is!*

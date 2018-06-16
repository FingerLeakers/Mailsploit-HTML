## Introducing Mailsploit

Mailsploit is a new way to easily spoof email addresses. It allows the attacker to display an arbitrary sender email address to the email recipient. In the following demo I use potus@whitehouse.gov but any other email address could be used.

And this is how it works: In an email, all headers must only contain ASCII characters, including the “From” header.

The trick resides in using [RFC-1342](https://tools.ietf.org/html/rfc1342) (from 1992!), a recommendation that provides a way to encode non-ASCII chars inside email headers in a such way that it won't confuse the MTAs processing the email.

Unfortunately, most email clients and web interfaces don’t properly sanitize the string after decoding which leads to this email spoofing attack.

Here is what it looks like:

`=?utf-8?b?[BASE-64]?=`

`=?utf-8?Q?[QUOTED-PRINTABLE]?=`

Either base64 or the quoted printable representation can be used.

Using a combination of control characters such as new lines or null-byte, it can result in hiding or removing the domain part of the original email, allowing us to replace it. Here is why:

- iOS is vulnerable to null-byte injection
- macOS is vulnerable to “email(name)” injection

Mixing both of them turns out to work perfectly on both OSs:

`From: =?utf-8?b?${base64_encode('potus@whitehouse.gov')}?==?utf-8?Q?=00?==?utf-8?b?${base64_encode('(potus@whitehouse.gov)')}?=@mailsploit.com`

Which becomes:

`From: =?utf-8?b?cG90dXNAd2hpdGVob3VzZS5nb3Y=?==?utf-8?Q?=00?==?utf-8?b?cG90dXNAd2hpdGVob3VzZS5nb3Y=?=@mailsploit.com`

Which, once decoded by Mail.app, becomes:

`From: potus@whitehouse.gov\0(potus@whitehouse.gov)@mailsploit.com`

Using this payload, both macOS and iOS will show that the email comes from `potus@whitehouse.gov` and not `…@mailsploit.com`:

- iOS will discard everything after the null-byte
- macOS ignores the null-byte but will stop after the first valid email it sees (due to a bug in the parser)

In order to avoid that the victim sees a glitch when trying to reply to the email, it is enough to add a “Reply-to” field:

`Reply-To: potus@whitehouse.gov`

Here is a demonstration of the bug on iOS:

@[youtube](https://www.youtube.com/watch?v=hwjUROtXV5I?autoplay=1)

Payloads usually differ between clients, but tweaking them could eventually make most of the clients react to the same payload.

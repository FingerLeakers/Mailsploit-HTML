### Should DKIM signatures not make this impossible?

DMARC is not attacked directly, but rather bypassed by taking advantage of how the clients display the email sender name. The server still validates properly the DKIM signature of the original domain and not the spoofed one.

While MTAs not only don’t detect and block these spoofed email addresses, they will happily relay those emails as long as the original email seems trustworthy enough (the attacker can therefore ironically profit from setting up DMARC on that email address). This makes these spoofed emails virtually unstoppable at this point in time.

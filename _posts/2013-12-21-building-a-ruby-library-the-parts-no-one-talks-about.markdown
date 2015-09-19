---
title: 'Building a Ruby Library: The Parts No One Talks About'
date: 2013-12-21 00:00 EST
tags:
  - ruby
  - gems
  - best practices
---

[Mitchell Hashimoto's talk from Aloha Ruby Conf](https://speakerdeck.com/mitchellh/building-a-ruby-library-the-parts-no-one-talks-about) is an opinionated look at the simple, easy-to-overlook but important-to-get-right aspects of writing a Ruby library. Everybody understands the importance of an intuitive API and good tests, but Hashimoto has advice on:

<!--more-->

* **configuration**: make it simple, do it in Ruby, and keep it all in one place
* **logging**: actually do it, and use a logging library (not Ruby's standard logger) that allows namespacing, so people using your library can choose what functionality they want to see logs about
* **exceptions**: have custom exceptions (but use standard exceptions when appropriate) and only rescue your library's own exceptions, since exceptions you *didn't* anticipate are probably bugs
* **documentation**: as with tests, it's less painful to write docs from the start as you work, and he recommends [YARD][1]
* **support**: make it clear how people can get it, whether it's an email address, mailing list, or on Github issues; you don't need to monitor it 24/7, but people need to know where to go for help

<script async class="speakerdeck-embed" data-id="4fca431e928d7202ab009b70" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>

 [1]: http://yardoc.org/

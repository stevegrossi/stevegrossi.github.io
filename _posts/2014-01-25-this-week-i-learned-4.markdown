---
title: 'This Week I Learned #4'
date: 2014-01-25 00:00 EST
tags:
  - rails
  - wordpress
---

An assets gotcha to avoid when upgrading from Rails 3 to 4, keeping WordPress theme comments around with Sass, and an intro to one of my favorite new development tools: the virtualization-management tool Vagrant.

<!--more-->

## Upgrading from Rails 3 to 4 Won't Minify Your Assets By Default

This one caught me by surprise while I was trying out Google's [PageSpeed Insights Chrome extension][1]. Rails 4 seems to require a new configuration syntax to minify your text assets (like stylesheets and scripts). Newly generated Rails 4 apps will include it by default, but if you're upgrading from Rails 3 you have to adjust your config/environments/production.rb as shown:

    Widgets::Application.configure do
      # config.assets.compress = true <- remove the Rails 3 setting
      config.assets.js_compressor  = :uglifier
      config.assets.css_compressor = :sass
    end

## How to Keep WordPress Theme Comments Using Sass’ Indented Syntax

Because I don't like typing semicolons or curly braces, I prefer Sass' indented syntax to its more verbose SCSS syntax. But it took me a while to find out out how to preserve the theme metadata comment that WordPress requires in a theme's style.css. I don't know why, because it's [right there in the Sass manual][2].

Like most everything else with indented syntax, comments are simply indented below the opening comment signifier:

    /*!
      Theme Name: Work
      Author: Steve Grossi

And including the trailing exclamation mark makes sure Sass preserves the comment, even with Sass' "compressed" output.

I did discover that, if your stylesheet includes any UTF-8 characters, you can't keep Sass from putting an `@charset "UTF-8";` declaration at the start of it, before the WordPress theme comment. However, this doesn't interfere with WordPress' ability to parse the file.

## Why and How to Use Vagrant

I had heard about Vagrant when its creator was the guest on [an episode of the Ruby Rogues][3], but it seemed complicated and I didn't really understand why you would use it. This week, both of those opinions changed.

Vagrant is a tool for easily describing and quickly instantiating virtual machines for local development. You add a `Vagrantfile` to your project that says, for example, "boot up this version of Linux and install these versions of Ruby, Apache, and Passenger". Then, when you or anyone on your team needs to run a development server, you just run `$ vagrant up` and in a few minutes your app is running on a virtual machine with exactly those specifications.

Why would you want to do this? Lots of reasons:

* **Parity with Production**: just because your app works on your mac with years' worth of downloads and software patches doesn't mean it'll run on a production Linux box. Vagrant lets you develop in the same exact environment that you'll be deploying to, so you'll catch bugs faster.
* **Parity with Other Developers**: With Vagrant, gone are the days of having to sit down with a teammate for half an hour to get him or her set up with your project, installing dependencies, creating databases and users, and the like. Vagrant forces you to be explicit about what your app needs to run, and by keeping your Vagrantfile in source control, anyone else picking up your project automatically has what they need to run it. Oh, and since Vagrant is platform-independent, it's no extra trouble if you're on a mac and a co-worker is on a PC.
* **A Disposable Environment**: with your code running in a virtual machine, you can try all kinds of crazy stuff without fear or corrupting your app or your local development machine. `$ vagrant destroy` when you're done, and your next `$ vagrant up` brings you right back to where you began.
* **Test Deployment**: a virtual machine behaves like another computer, so you can test infrastructure automation tools like [Puppet][4] and [Chef][5], deployment scrips like [Capistrano][6], or anything else you'd use to interact with remote servers without actually having to leave your LAN.

The best part about Vagrant is that you get all of these benefits of a virtualized environment without having to actually code on it! Vagrant comes with port forwarding, so you can use your favorite browser on your host machine to browse pages being served from the virtual machine. And Vagrant syncs your project's root directory (where the Vagrantfile lives) with a '/vagrant' directory on the virtual machine, so you can edit code on your host box in your editor of choice and have it updated automatically on the virtual box.

I initially thought such a tool would be massively complicated, but Vagrant turned out to be simple to get started wth thanks to the Vagrant team's [excellent documentation][7].

 [1]: https://chrome.google.com/webstore/detail/pagespeed-insights-by-goo/gplegfbjlmmehdoakndmohflojccocli?hl=en
 [2]: http://sass-lang.com/documentation/file.INDENTED_SYNTAX.html#comments
 [3]: http://rubyrogues.com/082-rr-vagrant-with-michael-ries/
 [4]: http://puppetlabs.com/
 [5]: http://www.getchef.com/
 [6]: http://capistranorb.com/
 [7]: http://docs.vagrantup.com/v2/getting-started/index.html

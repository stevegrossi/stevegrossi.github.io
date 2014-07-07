---
title: "Provisioning a LAMP Stack and WordPress with Chef, Part 1: Apache, MySQL, and PHP"
date: 2014-06-24 08:00 EDT
tags: devops, wordpress
---

After years of getting less and less while paying more and more for shared hosting, I finally decided to spin up my own (virtual) server to host a few WordPress sites. I chose to provision the server with [Chef](http://www.getchef.com/), which lets you describe how you'd like the server set up with a handy Ruby <abbr title="Domain-specific Language">DSL</abbr> and Chef takes care of the rest. Chef lived up to its reputation for being incredibly powerful, but it took me longer than I'd hoped to really understand how to use it. What follows is the blog post I wish I'd had available before jumping in.

READMORE

## Chef in a Nutshell

The idea behind Chef is to describe *in code* how a server should be set up, and then let Chef do the installation and configuration. It's a simple idea, but the advantages are numerous: not only can you then set up a second server with close to zero effort, but perhaps more importantly, the server configuration is transparent (and ideally under version control). No more wondering why an app won't run and it's because the original sysadmin made an undocumented configuration change before leaving the company.

Learning Chef means learning some new language. Here are some of the primary concepts:

### Solo vs. Server

Chef comes in two flavors: solo and server. With Chef Solo, your computer pushes updates directly to the server(s) you're managing. With Chef Server, however, your computer pushes updates only to a centralized Chef server, and your individual servers check-in periodically with that central server and update themselves with the latest updated. I used Solo since I'm managing only a single server.

### Recipes

Recipes do most of the work with Chef. They're just Ruby files which make use of the Chef DSL. They might describe that a directory should exist and have certain permissions:

    directory '/var/www/myapp' do
      mode '755'
    end

...that a certain file should be in place:

    template '/var/www/myapp/index.html' do
      source 'index.html.erb'
      variables(title: 'Hello, world!')
    end

...that a service should be running:

    service 'apache' do
      action :start
    end

or any of a number of other things. Basically, any change you would normally make to the server, you make to the recipe.

### Cookbooks

Cookbooks are collections of recipes, along with some extra goodies like default settings, data, template files, and more. There's a [rich library](http://community.opscode.com/cookbooks) of other peoples' cookbooks you'll almost certainly depend on, but for many things you'll write your own.

Cookbooks can use each other's recipes, so if you want to use someone else's cookbook but with minor changes, a common convention is to create a “wrapper cookbook” that does little more than pull in one of their recipes and overide a setting:

    # site-cookbooks/my-apache/recipes/default.rb
    include_recipe 'apache'
    override['apache']['some_config'] = 'my_config'

### Nodes

Chef is capable of managing a single server or a herd of thousands. Each one is a "node" in Chef, and nodes can have their own *attributes* which customize how recipes work. So you can have a single recipe (e.g. MySQL) behave differently (e.g. use a different port) on different servers without having to copy-and-modify the recipe.

### Attributes

How do nodes know which attributes can be customized for a recipe? Within a recipe (or within a cookbook to apply to all its recipes), you can specify and make use of default attributes that can be overridden later on. Use these for things like IP addresses, database names, or secret keys.

### Data Bags

Speaking of secrets, you shouldn't save these in plain text, of course (especially if sharing your recipe somewhere like Github). This is where Chef's "data bags" come in. They let you encrypt sensitive data and then retrieve it within recipes (or elsewhere):

    mysql_pass = Chef::EncryptedDataBagItem.load("passwords", "mysql")

### More

Chef has allowances for "roles" and "environments" in your deployment, but for setting up a single LAMP server I didn't find these necessary.

## Getting Started

After hearing great things about them from colleagues, I chose [Digital Ocean](https://www.digitalocean.com/?refcode=1a05e9e6a41f) to host my VPS. The setup couldn't have been simpler. With a minute I had a virtual private server hosted at a unique IP with SSH access ready to go. The rest of this walkthrough will assume you have the same, either with Digital Ocean or someone else.

(And to save you some trouble, choose ubuntu 12.4 as your OS. I spent a lot of time troubleshooting an obscure Apache issue that traced back to the fact that Ubuntu 14 ships with Apache 2.4, which the Apache cookbook [doesn't yet support](https://tickets.opscode.com/browse/COOK-3900).)

Next, create a directory and git repository to house your server configuration. That way, you can track server configuration changes the same way you track code changes. 

Start with a very simple Gemfile:

    source 'http://rubygems.org'
    ruby '2.1.2'

    gem 'knife-solo'
    gem 'librarian-chef'

Knife is command-line tool you'll use to invoke Chef commands, and which pulls in Chef itself as a dependency. Librarian-chef is a tool like Bundler for installing cookbooks from an official repository. (I'd [read tutorials](http://adamcod.es/2013/06/04/deploy-a-basic-lamp-stack-digital-ocean-chef-solo.html) saying Chef wouldn't work with Bundler or newer versions of Ruby, but I didn't have any problems with either.)

Upon installing these gems with `$ bundle install`, run `$ knife solo init .` from the project root to set up a typical Chef directory structure. This will give you a Cheffile which, similar to a Gemfile, is where you specify any cookbook dependencies. Let's add some now:

    site 'http://community.opscode.com/api/v1'

    cookbook 'apache2'
    cookbook 'mysql'
    cookbook 'php'

Running `$ librarian-chef install` will fetch them from the Opscode repository. Third-party cookbooks will be stored in the "cookbooks" directory of your project, and any of our own cookbooks we create will go in "site-cookbooks".

At this point, we've fetched and installed some third-party cookbooks, but we're not actually using them yet. (Remember, we haven't yet interacted with the server at all.) In order to do so, we have to tell Chef about this "node." We'll do this by creating a JSON configuration file in the "nodes" directory of our project:

    # nodes/123.45.67.890.json
    {
      "run_list": [
        "recipe[apache2]",
        "recipe[apache2::mod_php5]",
        "recipe[mysql::client]",
        "recipe[mysql::server]",
        "recipe[php]",
        "recipe[php::module_mysql]"
      ]
    }

Notice the JSON file is named after the IP address of our VPS. (You should be able to get that from your host, as I did from Digital Ocean.) Chef can also use a hostname, so you might create a DNS A-record pointing from, say, test-server.mywebsite.com to your VPS's IP address, and then naming this file `test-server.mywebsite.com.json`, which is a bit more human-readable.

The `run_list` in this file tells Chef which recipes to run on the server. Some lines refer to specific recipes (e.g. `recipe[apache2::mod_php5]`) while others refer just to the cookbook (e.g. `"recipe[apache2]"`) which implicitly refers to a default recipe (`"recipe[apache2::default]"`). I arrived at this particular list of recipes through a good deal of trial-and-error. For example, the mysql cookbook initially used a default recipe (`"recipe[mysql]"`) as I saw in many tutorials, but when this gave me an error, I discovered that it now requires referring to the specific server and client recipes as I've done above. If you run into trouble, recipe READMEs should be pretty reliable in telling you how to invoke them.

With our node file created, Chef now knows where to find our server and what belongs on it, so let's let Chef do its thing. When first having Chef set up a server, the command to use (from the project root) is:

    $ knife solo bootstrap root@123.45.67.890

(Replace the dummy IP adress with your server's, or its hostname if you set that up.) Knife-solo's `bootstrap` combines the functionality of two sub-commands:

* `knife solo prepare`: which installs Chef on your server (technically, Chef runs on your server, not your local machine)
* `knife solo cook`: which uploads your "kitchen" (your current Chef configuration) to the server for Chef to set up. (After the initial `bootstrap`ping, you'll just use `knife solo cook` to push new configuration changes to your server.)

Chef will show you a bunch of output, and if all goes well it should finish with something like

    Chef Client finished, 39/48 resources updated in 51.492024561 seconds

And if you navigate to your server's IP address, you should see an Apache 404 error (more on fixing that in a moment).

Alas, things didn't go quite to smoothly on my first try. Instead, Chef was getting a "Not Found" error when trying to install itself on my server:

    Downloading Chef 11.14.0.alpha.2 for el...
    downloading https://www.opscode.com/chef/metadata?v=11.14.0.alpha.2&prerelease=false&nightlies=false&p=el&pv=6&m=x86_64
    to file /tmp/install.sh.1750/metadata.txt
    trying curl...
    ERROR 404
    Unable to retrieve a valid package!

[Stack Overflow](stackoverflow.com/questions/23591190/knife-solo-prepare-fails) pointed me to the fact that the current version of the Chef gem on Rubygems.org is, surprisingly, an alpha release that the Chef CDN apparantly isn't prepared for. It was thankfully a simple workaround to force using the latest stable version of Chef:

    knife solo bootstrap root@162.243.8.115 --bootstrap-version=11.12.8

## Configuring Apache

On that second try, everything worked out (I've never been so happy to see a 404 from Apache!) The 404 is because we haven't installed Apache's default site, so let's fix that now. Here, you can see the impressive power of chef. Instead of having to reinstall Apache or FTP a bunch of files, we simply add some additional configuration to our node file:

    # nodes/123.45.67.890.json
    "run_list": [
      "recipe[apache2]"
      // ...
    ],
    "apache": {
      "default_site_enabled": true
    }

After the `"run_list"` array, we can add individual configuration options for our cookbooks. Here, we're just telling Apache that we want the default site to be installed. (In general, Chef cookbooks aim to provide the bare minimum so as to avoid installing anything unnecessary, so you may find yourself enabling a lot of non-default functionality in this way.)

Now, we'll run `$ knife solo cook root@[your IP adress or hostname]` and Chef will take care of the rest: updating our server so that its configuration matches our specification. As before, Chef will display its familiar output followed by something like 

    Chef Client finished, 3/43 resources updated in 6.451115471 seconds

Navigating to our server's IP address, we should see the default Apache site.

### A Side-note on Apache Performance

After having Chef install Apache, I noticed that Chef began reporting errors like

    FATAL: Errno::ENOMEM: Cannot allocate memory - fork(2))

which were preventing me from running `$ knife solo cook`. Inspecting my server, it appeared that Apache was maxxing out  the available 512MB of RAM. From what I've read, with a web server you kind of want Apache to use as much RAM as it can, but clearly this wouldn't work if it was prevent Chef from running. I think that by default Apache is tuned for more powerful servers than my little Digital Ocean box, so I had to dial it back in my node's Apache config:

    # nodes/123.45.67.890.json
    "apache": {
      "prefork": {
        "startservers": 2,
        "serverlimit": 4,
        "maxclients": 4
      }
    }

This is pretty extreme, but was necessary for now to get my server's RAM usage low enough for Chef to be able to run again. I'll certainly take a more nuanced approach to tuning Apache at a later date.

## Configuring PHP

Next let's make sure PHP is configured. We'd included some PHP recipes that should take care of ensuring PHP is installed and Apache is aware of it (and that PHP is aware of MySQL, which we'll address next):

    "recipe[apache2::mod_php5]",
    "recipe[php]",
    "recipe[php::module_mysql]"

So let's SSH into the server and put a PHP test file in the web root.

    $ ssh root@123.45.67.890
    $ cd /var/www
    $ echo "<?php phpinfo();" > info.php

(Typically, we wouldn't interact directly wth the server like this, but since it's just a temporary file, we'll do this manually to keep things simple.)

Now, navigating to http://123.45.67.890/info.php we should see the standard PHP Info page. If that's the case, we can now remove the file:

    $ rm /var/www/info.php

## Configuring MySQL

To test that MySQL is installed, let's SSH in and open up a MySQL console:

    $ ssh root@123.45.67.890
    $ mysql -u root -pilikerandompasswords

This should drop you into a nice MySQL console, and don't exit it just yet. Naturally, we'll want to change the default password that the cookbook provides. While we can and should provide that as an option in our node file (replacing "yoursecurepassword" with something actually secure):

    # nodes/123.45.67.890.json
    "run_list": [ // ...
    "mysql": {
      "server_root_password": "yoursecurepassword",
      "server_repl_password": "yoursecurepassword",
      "server_debian_password": "yoursecurepassword"
    }

We can't just run `$ knife solo cook` because Chef won't update the existing root password. In this case, we'll need to manually update it in the console as well with

    mysql > SET PASSWORD FOR root@'localhost' = PASSWORD('yoursecurepassword');

Now we can close out the MySQL console and test the new root password with

    $ mysql -u root -pyoursecurepassword

which should drop us back into a `mysql >` prompt.

## Conclusion

At this point, we have a functioning LAMP stack on a server that we control, all without having to manually install a thing! But of course, what good is a server if it's got nothing to serve, so check our [Part 2 of this series on using Chef to install and configure WordPress](/2014/07/06/provisioning-a-lamp-stack-and-wordpress-with-chef-part-2/).

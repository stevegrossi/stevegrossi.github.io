---
title: "Provisioning a LAMP Stack and WordPress with Chef, Bonus Part: Deploying Themes with Git"
date: 2014-07-19 07:43 EDT
tags:
  - chef
  - git
  - wordpress
  - devops
---

Having [set up a server](/2014/06/24/provisioning-a-lamp-stack-and-wordpress-with-chef-part-1.html) and [WordPress installation](/2014/07/06/provisioning-a-lamp-stack-and-wordpress-with-chef-part-2.html) without manually FTPing a single file, it would be a shame to have to ask Chef to install an FTP client so that we can upload and update our theme files the old-fashioned way. Fortunately, we don't have to! Matt Banks has [an excellent technique for using Git to deploy WordPress themes](http://mattbanks.me/wordpress-deployments-with-git/), which I'll be automating with a Chef recipe.

<!--more-->

## Create a Local Git Repository for Our Theme

If you haven't already, it's a great idea to keep your WordPress themes under version control with Git. Not only will you have a record of every change made to your theme, but Git makes it easy to experiment without ever losing sight of your last functional version. After [installing Git](http://git-scm.com/book/en/Getting-Started-Installing-Git) on your local machine, navigate to the directory of the WordPress theme you'd like to use (replace "my_theme" with the name of your theme for the rest of the tutorial) and initialize it as a Git repository:

    $ cd wp-content/themes/my_theme
    $ git init .
    $ git add --all
    $ git commit -m "Initial commit"

Now we'll set our server as a Git remote, so we can push our theme code there:

    $ git remote add production ssh://root@IP_OR_HOSTNAME/var/git/my_theme.git

You may wonder what `/var/git/my_theme.git` refers to. At the momemt, nothing, but we'll have Chef create it to house a bare repository to receive our `git push`. It's a best-practice [not to push to repositories with a working directory](http://gitready.com/advanced/2009/02/01/push-to-only-bare-repositories.html), so we'll have Chef create a bare repository on our server and add a `post-receive` hook to check out the latest version of our theme into the standard "wp-content/themes" directory of our WordPress installation.

## Adding to Our Cookbook

For this to work, we'll need Git installed on our server, so let's add `cookbook 'git'` to our Cheffile and run `$ librarian-chef install` to download it. We should also specify it as a dependency:

```ruby
# site-cookbooks/my_site/metadata.rb
depends 'git'
```

And add it to our node's `run_list`:

```ruby
# nodes/IP_OR_HOSTNAME.json
{
  "run_list": [
    "recipe[git]"
```

Before we get started building the recipe for our site, let's add one more attribute to our cookbook for the name of the Git repository, to avoid having to repeat it:

```ruby
# site-cookbooks/test_site/attributes/default.rb
default[:test_site][:theme_name] = 'my_theme'
```

And now for the recipe:

```ruby
# site-cookbooks/my_site/recipes/deploy.rb

# Create a directory for the bare repository
bare_repo = "/var/git/#{node[:test_site][:theme_name]}.git/"
directory '/var/git/'
directory bare_repo

# Create a directory for the theme
theme_dir = "#{node[:test_site][:app_root]}wp-content/themes/#{node[:test_site][:theme_name]}/"
directory theme_dir

# Create the bare repository
execute 'initialize_bare_repo' do
  command "cd #{bare_repo} && git --bare init"
  not_if { ::File.exists?(bare_repo + 'HEAD') }
end

# Set the post-receive hook
template bare_repo + 'hooks/post-receive' do
  source 'post-receive.erb'
  mode '0777'
  variables(deploy_to: theme_dir)
end
```

That final `template` block creates the `post-receive` hook we'll rely on to move our updated files into the right place. Git hooks like this are typically simple shell scripts which run automatically after certain events such as receiving a push. The Chef template for ours will look like this:

```erb
<%# site-cookbooks/my_site/templates/default/post-receive.erb %>
GIT_WORK_TREE=<%= @deploy_to %> git checkout -f
```

And it simply moves our pushed theme files into the "wp-content/themes/my_theme" directory, which we supplied in the `template` block as the `deploy_to` variable.

Now, all that remains is to include this "deploy.rb" recipe in our "default.rb":

```ruby
# site-cookbooks/my_site/recipes/default.rb
include_recipe 'my_site::deploy'
```

for Chef to run the next time we

    $ knife solo cook root@IP_OR_HOSTNAME

Once Chef is successful, we can make an update to our theme locally, `git commit` it, and push it live with `git push production master`.

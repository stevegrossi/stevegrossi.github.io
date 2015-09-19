---
title: Building the Future
date: 2013-01-01 15:16 UTC
tags:
  - perspective
---

I had a revelation a few years ago while thinking about *Minority Report*, specifically that scene in the beginning when Tom Cruise is interacting with the futuristic crime computer like the conductor of an orchestra. (If you haven't seen it, Tom Cruise is in front of a translucent desktop full of media—documents, videos, images—which he manipulates with his hands in midair.) I realized that one day websites might work like this. Not that they necessarily should, but that they could. It suddenly seemed very silly to be looking for inspiration toward the top sites of last year, or even current trends. No ma'am, not when there was a future to be built.

<!--more-->

Of course, printing search results one at a time on to wooden spheres and dispensing them like gumballs is a tad inefficient, which is why the measure of any prediction is whether it would make life easier, better, or both. So, for this blog’s inaugural post at the beginning of this new year, I'd like to begin with some predictions for what the websites of the future will be like.

## Myriad Screens

The notion that a website is something you sit down and look at on a computer monitor is beyond outdated. As mobile usage continues to grow (perhaps [surpassing desktop usage by next year][1]), you've at least got to contend with more people accessing your content on smaller, often less-capable devices on typically slower network connections. But “mobile” doesn't tell the whole story. Video game consoles, Smart TVs, and even refrigerators are increasingly web-enabled. So how should we website-makers respond to this fast array of devices and capabilities? By beginning, in mobile-first fashion, with [fundamentally sound typography][2] for when screens too small to accommodate complicated layouts. Then, use media queries to enhance the layout for larger screens, applying new rules *when the content requires it*, not with any particular device in mind. (Optimizing for specific devices leaves you forever playing catch-up as device specs change and new ones emerge. Optimize for your content and it will always look appropriate.)

## Myriad Platforms

On the back-end, make your data (at leads potentially) ready for all platforms by building an API. Luke Wroblewski wrote [a great article on the Bagcheck blog][3] on how API-first design is the back-end analogue to mobile-first design. Even if it’s just for you, an API to your data means the hard work is already done when it comes to porting it to new platforms. And if it’s a public API (and your data is worth playing with), you'll have people working for free to do new and interesting things with it.

## Myriad Resolutions

Phones have had high-pixel-density displays for years, and this year saw the release of the first laptop with one: the MacBook Pro with a Retina display. Before long, pixels, like scan lines on CRT monitors, will be a thing of the past. The human eye can distinguish resolutions up to about 300 pixels per inch, so expect all displays to eventually end up somewhere past that number. In the meantime, the iPhone 5 has a resolution of 326 pixels per inch; the new Kindle Paperwhite has a resolution of 212 ppi; and your grandmother’s Dell monitor still has a resolution of around 100 ppi.

How is a developer to cope with this array? First, any graphics that can be made resolution-independent (as icon fonts, SVG images, or with pure CSS) should be. Effects like rounded corners, drop-shadows, and [even many background patterns][4] that were once accomplished with images can now be done with CSS3. As for raster graphics like photos, a lot of smart people are working on some clever solutions, but in the meantime a promising approach seems to be [serving highly-compressed high-resolution images scaled down with CSS][5] for lower-resolution displays. This way, the compression artifacts get scaled down as well, leading to an impressively smooth image.

## Back to the Content

When I want to find a restaurant’s menu or address, I've begun using Yelp in favor of most restaurants' own websites, which often make me click through an intro page in order to download a 3MB PDF that their menu designer gave their webmaster to upload. I don't mean to pick on mom-and-pop restaurants, who obviously don't have hundreds of thousands of dollars to spend on engineering talent like Yelp does, but the fact remains that when it comes to seeking information, people choose the paths of least resistance. Any website that wants a reason to exist will need to provide its unique content in as straightforward and user-friendly a way as possible. Speed is a concern, especially on slower mobile connections, so maybe skip that humongous banner image at the top of the page. Consider marking upon contact info with [microformats][6] so that phone numbers can be clicked to initiate a call or an address can be exported to a maps app or address book. And of course take every step to make your content [accessible to everyone, regardless of disability][7].

## Meatspace Compatible

Meatspace (a colorful term I get from William Gibson’s *Neuromancer*) and cyberspace are converging. Or, as Mr. Wroblewski puts it in his eponymous theorem, [“Anything that can be connected to the Internet, will be.”][8]. What this will mean for makers of websites is anybody’s guess, but those with flexible platforms, content, and data will be best poised to take advantage of it.

For instance, I just got a FitBit for Christmas, which is a pedometer for tracking how many steps you take each day that you can also wear on your wrist at night to roughly measure and track how well you sleep by how little you toss and turn, get up, etc. But the cool part is that it integrates with their website and iPhone app, through which you can additionally log food and water consumption, exercise, weight, and mood. I'm still collecting data, but ideally this will let me explore patterns around how aspects of my lifestyle fit together. Does eating certain things affect my mood more than others? Do I sleep better when I exercise? And so on.

I can imagine one day soon in which I can grant my favorite restaurant’s website or app temporary access to the last week of my meal tracking data, and it can suggest a dish based on what I've been eating (or more optimally, what I should be eating). Or perhaps my health insurance provider’s website may one day connect with my Fitbit and offer slightly lower premiums as a reward for consistent exercise.

Whereas tools like the Fitbit are about putting real-world data into computers, there are other exciting developments centered around getting data out of computers. Two of my coworkers are using the Arduino microprocessor to make a neon sign in the shape of a Tumblr “T” to light up every time someone reblogs one of our posts on that service. I truly hope we'll see more of this kind of ambient information. Even something as simple as an LED on my key hook that connects to a weather service and lights up when rain is predicted would be a welcome augmentation to my woefully inadequate meteorological faculties.

Finally, the ways we interact with computers are going to change radically. Touch screens are already here, but soon we'll have screens that touch us back by responding with textures. (I can't wait for `-webkit-texture: sandpaper` in my stylesheets!) And soon we won't even need to touch our devices. Makers are already using Microsoft’s Kinect motion sensor to experiment with [gestural interfaces like those in *Minority Report*][9].

While there may not be much the average website owner can do right now about ambient information and gestural interfaces, the important thing is to stop thinking of websites as pictures on a box and start thinking about—and building them—as so much more.

## Build the Future

I'll leave you with [Connecting, a short film about interaction design][10] on Vimeo, which was the inspiration for this post.

[1]: http://www.businessinsider.com/mobile-will-eclipse-desktop-by-2014-2012-6
[2]: http://www.welcomebrand.co.uk/thoughts/the-responsive-web-will-be-99-9-typography/
[3]: https://bagcheck.com/blog/8-bagchecking-in-the-command-line
[4]: http://lea.verou.me/css3patterns/
[5]: http://blog.netvlies.nl/design-interactie/retina-revolution/
[6]: http://microformats.org
[7]: http://a11yproject.com/
[8]: http://www.lukew.com/ff/entry.asp?1592
[9]: http://singularityhub.com/2010/12/10/mit-uses-xbox-kinect-to-create-cheap-minority-report-interface-video/
[10]: http://vimeo.com/52861634

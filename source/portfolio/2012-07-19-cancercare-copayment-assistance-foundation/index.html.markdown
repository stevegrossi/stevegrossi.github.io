---
title: Cancer<i>Care</i> Co-Payment Assistance Foundation
client: Cancer<i>Care</i>
employer: Cancer<i>Care</i>
tags: design, development
images:
  - desktop.jpg
  - tablet.jpg
  - mobile.jpg
---

The Cancer<i>Care</i> Co-Payment Assistance Foundation is a separate organization housed within Cancer<i>Care</i>, and provides money to help people meet the co-payments for their cancer treatment medications. Cancer<i>Care</i>'s content manager and I worked with the Copay team to rebuild the organization's website, cancercarecopay.org. The goals we identified were to:

* Make it easier to find out whether you're eligible, to apply if you are, and to find assistance elsewhere if you're not
* Make it possible (easy, even!) for non-technical folk at Cancer<i>Care</i> to manage the site
* Build out content with stories and quotes from people the organization has helped, as well as special sections to acquaint for healthcare professionals and potential funders
* Extend the visual language of cancercare.org so that the Copay website looks like *a* Cancer<i>Care</i> website without looking too much like *the* Cancer<i>Care</i> website.
* Optimize the site for mobile devices, which the stats show an increasing number of people using to access the site

As a developer, I rebuilt the existing static HTML site on the WordPress content management system so that non-technical staff can easily log in and make necessary updates. I like to try something new with every WordPress project, and for this one I made content management even easier with something called "custom shortcodes". Something we do in several places on the site is list the diagnoses currently covered by the Foundation. When they would change, we'd have to update every page on which they appeared, which was a pain. To help, I set it up so that when you include the code <code>[covered_diagnoses]</code> in the body of a page, the system replaces that with a list of the currently covered diagnoses. Now, when coverage changes, every page that lists them is automatically updated.

On the design side, I built the site flexibly so that the layout adapts to screens large (your desktop), small (your phone), and anything in between. The design brief called for the look to borrow from Cancer<i>Care</i>'s existing online branding, which I extended to these flexible elements. As Cancer<i>Care</i>'s stable of websites grows, this work can serve as a flexible, future-friendly foundation.

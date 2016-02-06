---
title: How to proportionally scale images that have dimension attributes
date: 2013-06-14 00:00 EDT
tags:
  - images
  - responsive design
---

A [useful post by Roger at 456 Berea St.][1] on proportionally scaling images even when they have width and height attributes hard-coded in the HTML (such as WordPress does automatically). I'd been using a PHP function to remove them on WordPress sites:

<!--more-->

```php
// functions.php
function remove_width_and_height_atts($html) {
  return preg_replace('/(width|height)="\d*"\s/', "", $html);
}
```

But this is brittle. It would return invalid HTML if I had a data-attribute like `data-foo-height="300"`. I could make the regex more specific, but for speed and simplicity's sake I'd prefer not to muck about in the markup if CSS can do the job, and fortunately it can.

On a related note, [Google recommends setting width and height on all images][2], either in the HTML or in CSS rules that apply directly to the element or its block-level parent, to avoid browser repaints after each image loads. Unfortunately, this will only prevent a repaint if the image's final dimensions match those of the HTML attributes (so not for flexible-width images). It would be nifty if browsers took note of the intended aspect ratio from the HTML attributes (e.g. 4x3 if the width is 800 and the height 600) and carved out the right-sized space in the container (e.g. 400x300 if the container is 400px wide and the image is `max-width: 100%`) for the image before it loads, but in my testing no browser appears to do this.

Anyway, even if we can't avoid repaints for flexible-width images, the recommended style rules for flexible-width images with dimension attributes are:

```css
img {
  width: auto; /* IE8 needs me */
  max-width: 100%;
  height: auto;
}
```

 [1]: http://www.456bereastreet.com/archive/201306/how_to_proportionally_scale_images_that_have_dimension_attributes/
 [2]: https://developers.google.com/speed/docs/best-practices/rendering#SpecifyImageDimensions

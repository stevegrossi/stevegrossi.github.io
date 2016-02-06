---
title: "This Week I Learned #11"
date: 2014-07-05 12:50 EDT
tags:
  - ruby
  - unix
  - dns
---

This week I learned more Ruby tidbits from Exercism.io, including a new string method and a new use of Ruby's splat operator. Also, DNS debugging with some handy Unix utilities.

<!--more-->

## String#tr and Splatting Arguments

I've been [thoroughly engrossed in Exercism.io](/2014/06/20/collaborative-coding-with-exercism-io/), because even as I'm sharing my own knowledge, I'm constantly learning from others' solutions to problems. Case in point, I was doing an exercise that involved translating DNA to RNA, and thought I had a pretty elegant solution which looped over and changed the input string's characters based on a dictionary:

```ruby
class Complement
  COMPLEMENTS = {
    'G' => 'C',
    'C' => 'G',
    'T' => 'A',
    'A' => 'U'
  }

  def self.of_dna(sequence)
    sequence.chars.map { |nucleotide|
      COMPLEMENTS.fetch(nucleotide)
    }.join
  end
end
```

But after commenting on a few others, I learned of [Ruby's String#tr method](http://www.ruby-doc.org/core-2.1.2/String.html#method-i-tr), which directly translates a string by taking two arguments: a string of characters to change, and a string of characters to change them to. It's a bit of an oddball method---far narrower in application than something like String#gsub---but lo, I happened to be working on *the* textbook application for it, which let me solve this particular problem in half my original lines of code:

```ruby
class Complement
  DNA_RNA_MAPPINGS = ['GCTA', 'CGAU']

  def self.of_dna(sequence)
    sequence.tr(*DNA_RNA_MAPPINGS)
  end
end
```

I also discovered another use Ruby's handy splat operator. Last time, [I wrote about using the splat (`*`) operator](/2014/05/10/this-week-i-learned-10/) to convert a range to an array of numbers. But here, it can also be used to explode an array into a list of arguments. In the example above, it would be clearer just to pass `'GCTA'` and `'CGAU'` into `sequence.tr`, but extracting them to a class constant and splatting them into arguments let me <abbr title="Don’t repeat yourself">DRY</abbr> out another method on the class, for converting back from RNA to DNA:

```ruby
def self.of_rna(sequence)
  sequence.tr(*DNA_RNA_MAPPINGS.reverse)
end
```

## Benchmarking Ruby

Exercism.io is about teaching and learning to write better code. [The site's guidelines](http://help.exercism.io/nitpicking-code.html) rightfully address simplicity, maintainability, readability, and modularity, but code performance is conspicuously missing from the list. To be fair, the exercises thus far have been so small in scale that even a tenfold increase in performance would only save a tiny fraction of a second. But still, if two solutions are equally good in all other respects, I think one should choose the faster one. But how can you know which that is?

I'd seen Ruby benchmarks used on Stack Overflow, but until now never bothered to figure out how to run them. As it turns out, it's delightfully simple. Here is how I benchmarked two alternative solutions to an exercise which calculated a person's one-gigasecond birthday.

Benchmarks are just Ruby files which you can run on the command line, e.g. below with with `ruby benchmark.rb`

```ruby
# benchmark.rb
require 'benchmark'

Benchmark.bm(20) do |bm|

  bm.report 'One alternative' do
    100_000.times do
      # the code to benchmark
    end
  end

  # bm.report 'Another alternative'...

end
```

They consist of a `Benchmark.bm` block which will generate a table comparing the time-to-run for as many alternatives as you provide within `bm.report` blocks. `Benchmark.bm` takes an integer argument which is simply the width of the leftmost column of the table and which labels each row. Since the text of each label is the string argument to its `bm.report`, the integer passed to `Benchmark.bm` should just be larger than the length of the longest string passed to any `bm.report` block.

Running a benchmark will generate something like this:

                            user     system      total        real
    One alternative     1.033333   0.016667   1.016667 (  0.492106)
    Another alternative 1.483333   0.000000   1.483333 (  0.694605)

The `user` column is how long it took to execute only the code being benchmarked. `system` time is time spent executing kernel code during the benchmark, and `total` is just the sum of the two. Those three metrics are calculated across processor cores, so two cores each spending half a second will count a total of 1 second of computation, but only half a second of `real` time. `real` time is the actual time elapsed (i.e. on your watch), and will thus typically be less than the `total` time on multi-core machines.

## The Unix `host` and `dig` Tools

With Heroku phasing out the ability to point DNS A-records directly at their IP addresses in favor of CNAME records, I've had some DNS record updates to make on our older apps at work. But to check when DNS updates had successfully propagated, I'd been using sketchy, ad-ridden websites to do simple DNS lookups. Thankfully, as is nearly always the case, there's a Unix tool for that---at least two in this case.

The first is `host`, which, when given a hostname, will trace its aliases back to its IP adddress. For example:

    $ host www.stevegrossi.com
    www.stevegrossi.com is an alias for stevegrossi.herokuapp.com.
    stevegrossi.herokuapp.com is an alias for us-east-1-a.route.herokuapp.com.
    us-east-1-a.route.herokuapp.com has address 23.23.245.47

This was useful for testing that apex (sometimes called "naked") domain names did *not* point directly to Heroku IP adresses, but that the "www" subdomains did.

Another useful tool I found is `dig`, short for "domain information groper." Give `dig` a host name and it can fetch all of the DNS records from an authoritative name server, which is useful for confirming that DNS changes you've made have propagated. By default, `dig` includes some meta information about the query and doesn't include all DNS records, so I prefer to use it with some option flags. `+noall +answer` disables all output and then reenables only the "answer" section, which is the information we're interested in. And the `any` option shows any type of DNS record, the default being only A records. (Replace `any` with `mx` or `cname` to view only those types of records.)

    $ dig stevegrossi.com +noall +answer any
    stevegrossi.com.  2663  IN  SOA ns77.domaincontrol.com. dns.jomax.net. 2014062201 28800 7200 604800 3600
    stevegrossi.com.  2663  IN  A 50.63.202.20
    stevegrossi.com.  2663  IN  MX  5 ALT1.ASPMX.L.GOOGLE.com.
    stevegrossi.com.  2663  IN  MX  5 ALT2.ASPMX.L.GOOGLE.com.
    stevegrossi.com.  2663  IN  MX  10 ASPMX2.GOOGLEMAIL.com.
    stevegrossi.com.  2663  IN  MX  10 ASPMX3.GOOGLEMAIL.com.
    stevegrossi.com.  2663  IN  MX  1 ASPMX.L.GOOGLE.com.
    stevegrossi.com.  2663  IN  NS  ns77.domaincontrol.com.
    stevegrossi.com.  2663  IN  NS  ns78.domaincontrol.com.
    stevegrossi.com.  2663  IN  TXT "google-site-verification=sB9x_iHYUTDBH1KH0Ye_cywcuiFsKwfu8h30zoqtRJI"

And to save some repetitive typing, `dig` will read default options from a .digrc file in your home directory, so I simply created ~/.digrc containing:

    +noall
    +answer

And now I can just type `$ dig domain.com any` to inspect its current DNS records.

##CD.DateFieldView -- A Datefield and Calendar Picker for Sproutcore 

This is a _beta_ release of a view I started for a project I was working on.
I was surprised that Sproutcore did not have such a view or a calendar picker.
While I can't pretend to be a proficient SC coder yet, my hope is that through 
some input and collaboration with more experienced community members we can
produce something worthy of inclusion. 

###Features
*   Datefield validation
*   Accepts any known date format via built-in localization (native Javscript)
*   Calendar popup for quick selection or visualization
*   Integer operations relative to today's date _(e.g. `+1` would be today+1 day, `-1`...etc.)_

###Needs (incompletes, TODO, etc.)
*   Render is a mess due to my limited understanding of the view-layer (calendar)
*   Cleaner binding interface (datefield)
*   Needs dynamic resizing and position awareness - but at this point I do not know how to do this (both)
*   Needs month drop-down selector as opposed to just incremental scrolling (calendar)
*   Possibly remove statechart from view?
*   Possibly make use of Dynamic CSS (SC.CSSStyleSheet)?
*   ...

####General Notes

The DateFieldView has been tested with the following browsers:  

*   Safari ``Version 5.0.5 (6533.21.1)``
*   Chrome  ``Version 11.0.696.77``
*   Firefox ``Version 4.0.1``

#HOW TO USE

You can use it as-is or for testing/development purposes (please!) by including it as a 
framework in your project/app. I would recommend cloning the git repo and then symlinking it
into your frameworks directory.  

Make sure you have also required _sproutcore/statechart_.

####_Don't forget to add it to the requirements in the Buildfile for the project/app!_

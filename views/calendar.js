/*globals Xt */

/** @class

  The Xt.CalendarView is a selectable calendar which
  aims to support date selection in collaboration with 
  the Xt.DateFieldView. 
  
  This is a BETA.
  
  Features it currently *partially* implements:
  
    - date set by bound object
    - reports selected date
    - month-scrolling forward/backward
  
  Features that have yet to be added:
    
    - drop-down month selection
    - easier theming
    - more intelligent dynamic size control
    - scroll by year not just month  

  @extends SC.View
*/
Xt.CalendarView = SC.View.extend({

  // ..........................................................
  // PROPERTIES 
  //
  
  /** @private */
  childViews: 'nextMonthButton prevMonthButton'.w(),

  /**
    The classname `xt-calendarview' is required at this
    point without significant custom theming. Hopefully
    this will change in the near future.

    @type String
  */
  classNames: 'xt-calendarview',

  /**
    Because of the placement and custom rendering
    use of a static layout is required at this time.

    @type Bool
    @default YES
  */
  useStaticLayout: YES,

  /**
    This can be reset to any necessary size and
    the layout internally will attempt, in a rather
    unsophisticated manner, to adjust to the size
    
    @type Object 
  */
  layout: { width: 300, height: 300 },

  /**
    The view that will be responding to actions
    thrown by the view. In the case of Xt.DateFieldView
    this will be set to the parent which is also
    the statechart.

    @type 
    @default null
  */
  targetView: null,

  /**
    The bound date to read/write to with changes
    to dates.
    
    @type SC.DateTime
    @default null 
  */
  selectedDate: null,

  /**
    Properties that require display changes/updates.
    
    @type String  
  */
  displayProperties: 'selectedDate'.w(),

  /** @private
    Returns the appropriately formatted Month/Year
    for the calendar.

    @type String
    @observes selectedDate
  */
  monthAndYear: function() {
      var date = this.get('selectedDate') || SC.DateTime.create();
      return date.toFormattedString('%B %Y');
  }.property('selectedDate'),

  /** @private
    A button that will move one month previous to
    the currently selected date. Currently relies
    on the targetView to be set to a responder that
    correctly accepts and reacts to the action.

    @TODO: Should the calendar handle these events
      as opposed to sending them to the targetView?
  */
  prevMonthButton: SC.ButtonView.extend({
    useStaticLayout: YES,
    classNames: 'xt-calendarview-button left',
    title: "<",
    action: 'prevClicked',
    target: 'parentView.targetView',
  }),

  /** @private
    A button that will move one month after
    the currently selected date. Currently relies
    on the targetView to be set to a responder that
    correctly accepts and reacts to the action.

    @TODO: Should the calendar handle these events
      as opposed to sending them to the targetView?
  */
  nextMonthButton: SC.ButtonView.extend({
    useStaticLayout: YES,
    classNames: 'xt-calendarview-button right',
    title: ">",
    action: 'nextClicked',
    target: 'parentView.targetView',
  }),

  // ..........................................................
  // METHODS
  //

  /** @private
    Handles used-clicks within the bounds of the
    calendar view. If the click selected a valid
    date then the selectedDate property will be
    updated accordingly.
    
    @returns {void} 
  */
  click: function(e) {
    var selection = this._parseDateId(e);
    if(SC.typeOf(selection) !== 'object')
      return NO;
    else {
      this.set('selectedDate', selection);
    }
  },

  /** @private
    Detects changes to the selectedDate property
    and updates accordingly.
    
    @TODO: There seems to be another problem that
      makes this necessary. This may not be necessary
      if the issues to do with rendering are fixed.
    
    @observes selectedDate
  */
  selectedDateDidChange: function() {
    this.replaceLayer();
  }.observes('selectedDate'),

  /** @private
    @TODO: The current implementation relies on child-views
      but renders them arbitrarily in the overloaded render
      function the view uses a static layout. 
  */
  renderChildViews: function() {},

  /** @private
    Renders the calendar with the correct month, year
    and selected day.

    @TODO: This needs serious revision.
  */
  render: function(context, firstTime) {
    var content = [], that = this.get('parentView');
    var widthOfFrame = this.getPath('layout.width');
    var cellmargin = 1;
    var side = parseInt((widthOfFrame - (7*(2*cellmargin))) / 7 );

    context.push(
      '<div class="xt-calendarview-container">',
      '<div class="xt-calendarview-header">'
    );

    context = context.begin(
      this.getPath('prevMonthButton.tagName')
    );
    this.get('prevMonthButton').renderToContext(context, YES);
    context = context.end();

    context.push(
      '<span class="xt-calendarview-header-span">' + this.get('monthAndYear') + '</span>'
    );

    context = context.begin(
      this.getPath('nextMonthButton.tagName')
    );
    this.get('nextMonthButton').renderToContext(context, YES);
    context = context.end();
    context.push(
      '</div><div class="xt-calendarview-body">'
    );

    // calculate and render the calendar grid/days

    // conevenience access to the base selectedDate
    // selected is the currently selected date
    // var selected = that.get('selectedDate') ;
    var selected = this.get('selectedDate') || that.get('selectedDate') || SC.DateTime.create() ;

    // starting month is the current month starting at the first day
    var start_month = SC.DateTime.create({ day: 1, month: selected.get('month'), year: selected.get('year') }) ;

    // the start day is the 'day-of-the-week' that we are starting on
    var start_day = start_month.get('dayOfWeek') ;

    // the 'curr' variable is the day iterator that is initialized
    // to exactly 1 week prior to the current month
    var curr = start_month.advance({day:-start_day}) ;

    // the grid will contain 42 days
    var days = "", j = 0;
    for(var i=0; i<42; ++i) {

      if(j == 0)
        days += "<div>";
      if(j == 7) {
        days += "</div><div>";
        j = 0;
      }
        // var _d = SC.Object.create() ;
        var _d = {}, day;

        _d.day = curr.get('day') ;
        _d.month = curr.get('month') ;
        _d.year = curr.get('year') ;

        // add the faded class so it is clear the day is either from
        // the previous or next month and not the current month
        if(_d.month < selected.get('month') || _d.month > selected.get('month'))
          _d.fade = "fade" ;
        else
          _d.fade = "" ;

        if(_d.day == selected.get('day')
            && _d.month == selected.get('month'))
          _d.selected = "selected-day" ;
        else
          _d.selected = "" ;

        day = "<div id='xt-calendarview-" + _d.month + "-" + _d.day + "-" + _d.year + "' class='xt-calendarview-grid-day";
        if(_d.selected)
          day += " " + _d.selected;
        if(_d.fade)
          day += " " + _d.fade;
        day += "' style='width: " + side + "px; height: " + side + "px; margin: " + cellmargin + "px; '>" + _d.day + "</div>";

        days += day;

        curr = curr.advance({ day: 1 }) ;

      ++j;
    }

    context.push(
      days,
      '</div></div>'
    );
    this._didRenderChildViews = YES;
  },

  /** @private */
  didCreateLayer: function() {},

  /** @private
    Accepts an event and attempts to parse
    information associated with the target. If
    the target is a valid date of the rendered
    calendar then the date is parsed and a
    SC.DateTime object is created and returned.

    @returns {SC.DateTime} the date associated
      with the user-selection
  */
  _parseDateId: function(e) {
    var parts, orig = e.target.id;
    parts = orig.split('-');
    month = parts[2];
    day = parts[3];
    year = parts[4];
    return SC.DateTime.create({
      month: month,
      day: day,
      year: year
    });
  },

});
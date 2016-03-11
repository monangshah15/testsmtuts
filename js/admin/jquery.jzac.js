$(document).ready(function(){
    $(".left_border").on('mousehold',function(){
        $('.image_main').stop().animate({left: '-='+crop_consistent('left')}); //left arrow key            
    });
    
    $(".top_border").on('mousehold',function(){ 
        $('.image_main').stop().animate({top: '-='+crop_consistent('top')}); //top arrow key
    });
   
    $(".right_border").on('mousehold',function(){
        $('.image_main').stop().animate({left: '+='+crop_consistent('right')}); //right arrow key
    });
    
    $(".bottom_border").on('mousehold',function(){
        $('.image_main').stop().animate({top: '+='+crop_consistent('bottom')}); //bottom arrow key
    });
});

jQuery.fn.mousehold = function(timeout, f) {
	if (timeout && typeof timeout == 'function') {
		f = timeout;
		timeout = 100;
	}
	if (f && typeof f == 'function') {
		var timer = 0;
		var fireStep = 0;
		return this.each(function() {
			jQuery(this).mousedown(function() {
				fireStep = 1;
				var ctr = 0;
				var t = this;
				timer = setInterval(function() {
					ctr++;
					f.call(t, ctr);
					fireStep = 2;
				}, timeout);
			})

			clearMousehold = function() {
				clearInterval(timer);
				if (fireStep == 1) f.call(this, 1);
				fireStep = 0;
			}
			
			jQuery(this).mouseout(clearMousehold);
			jQuery(this).mouseup(clearMousehold);
		})
	}
}

//initialize jzak with parameters: 1) container width, 2) container height, 3) crop width, 4) crop height
function initialize_jzak(jzac_width,jzac_height,crop_width,crop_height, viewportMarginDiffLeft, viewportMarginDiffTop) {
    //value must be  1) container width (jzac_width) > crop width (crop_width)
    //value must be  2) container height (jzac_height) > crop height (crop_height)
    if((jzac_width < crop_width) || (jzac_height < crop_height) ) {
        alert('Can not initialise JZAC');
        return false;
    } 
    $('.pane img').css('min-height',crop_height);
    $('.pane img').css('min-width',crop_width);
    $('img').css('max-width','auto !important');
    
    var main_height = $('.image_main').height();
    var main_width = $('.image_main').width();
    var image_width_set;
    var image_height_set;       
    var set_view = (main_width/main_height);         
    if(set_view>=1){
        image_width_set = null;
        image_height_set = crop_height;            
    } else {
        image_width_set = crop_width;
        image_height_set = null;
    }       
    
    $(".top_border, .bottom_border").css('width',eval(jzac_width-(jzac_width-crop_width)));
    $(".top_border, .bottom_border").css('height',eval((jzac_height-crop_height)/2));
    $(".top_border, .bottom_border").css('margin-left',eval((jzac_width-crop_width)/2)); 
    $(".left_border, .right_border").css('width',eval((jzac_width-crop_width)/2));
    $(".left_border, .right_border").css('height',jzac_height);                  
                
    // Apply jzac on some image.
    $('.pane img').jzac({
        'jzac_width': jzac_width,
        'jzac_height': jzac_height,
        'crop_width': crop_width,
        'crop_height': crop_height,
        'viewportMarginDiffLeft':viewportMarginDiffLeft,
        'viewportMarginDiffTop':viewportMarginDiffTop,
        'crop_x': 0,
        'crop_y': 0,
        'image_width': image_width_set,
        'image_height': image_height_set,
        'zoom_min': 100,
        'zoom_max': 1000,
        'viewport_content_left': eval((jzac_width-crop_width)/2),
        'viewport_content_top': eval((jzac_height-crop_height)/2),
        'crop_resize': false,
        'viewport_resize': false,
        'viewport_onload': function() {
            var $viewport = this;
            var inputs = $viewport.$container.parent('.pane').find('.coords input:text');
            var events = ['jzac_crop_x','jzac_crop_y','jzac_crop_width','jzac_crop_height','jzac_image_width','jzac_image_height'];
            for (var i = 0; i < events.length; i++) {
            var event_name = events[i];
            // Register an event with an element.
            $viewport.observator.register(event_name, inputs.eq(i));
            // Attach a handler to that event for the element.
            inputs.eq(i).bind(event_name, function(event, $viewport, value) {
            $(this).val(value);
            })
            // Attach a handler for the built-in jQuery change event, handler
            // which read user input and apply it to relevent viewport object.
            .change(event_name, function(event) {
                var event_name = event.data;
                $viewport.$image.scale_proportion_locked = $viewport.$container.parent('.pane').find('.coords input:checkbox').is(':checked');
                $viewport.observator.set_property(event_name,$(this).val());
            });
        }
        //To print the original size of the image
        //$viewport.$container.append('<div>Image natual size: '+$viewport.$image.originalWidth+' x '+$viewport.$image.originalHeight+'</div>')
      }
    })
    .bind('jzac_events', function(event, $viewport) { // React on all viewport events.
        var inputs = $(this).parents('.pane').find('.coords input');
        inputs.css('background-color',($viewport.observator.crop_consistent()) ?'chartreuse':'salmon');
        if(!$viewport.observator.crop_consistent()){             
        }                                       
    });        
}
(function( $ ){
  $.fn.jzac = function(options) {
    // Default settings
    var settings = {
      'jzac_width': 250,
      'jzac_height': 150,
      'crop_width': 200,
      'crop_height': 100,
      'viewportMarginDiffLeft':17,
      'viewportMarginDiffTop':9,
      'crop_x': 0, // The two following properties define the crop position (relative to theimage).
      'crop_y': 0, // The two following properties define the crop position (relative to theimage).
      'crop_resize': true,
      'crop_aspect_ratio': null,
      'image_width': null,
      'image_height': null,
      'zoom_min': 100,
      'zoom_max': 3000,
      'viewport_resize': true,
      // The two following properties allow to position the content (negative value allowed). It can be use to focus the viewport on the cropped part of the image.
      'viewport_content_left': 0,
      'viewport_content_top': 0,
      'viewport_onload': null // Submit here a callback function (context is the viewport).
    };
    
    // Apply the resize and crop tools to each images
    return this.each(function() {
      if (!$(this).is('img')) {
        return;
      }
      // Read options
      var destroy = false;
      if ( typeof(options) == 'object' ) {
        $.extend( settings, options );
      }
      else if (options == 'destroy') {
        destroy = true;
      }      
      var $image = $(this);
      // Test if jzac was previously run
      var jzac_loaded = false;      
      if ($image.parent().hasClass('jzac_viewport')) {
        jzac_loaded = true;        
      }      
      if (jzac_loaded && destroy) {
        // Unload jzac if asked
        $image.draggable("destroy");
        $image.parent().find('.jzac_crop').remove();
        $image.parent().parent().find('.jzac_zoom_slider').remove();
        $image.parent().append($image.data('original')); // restore original image
        $image.parent().unwrap(); // remove container
        $image.unwrap(); // remove viewport
        $image.remove(); // remove image which was altered (in its css attributes)
      } else {
        // Record image before some of its attributes get altered by some 
        // jzac css or some user size or proportion changes.
        $image.data('original', $image.clone());
      }
      // Do nothing more if destroy is asked
      if (destroy) { return; }      
      // Prepare image
      if (!jzac_loaded) {
        $image.hide().css('position','absolute').wrap('<div class="jzac_container"><div style="height:'+settings.jzac_height+'px;  width:'+settings.jzac_width+'px;" class="jzac_viewport" id="main_view_port"></div></div>');
      }
      
      // Get viewport and container references
      var $viewport = $image.parent();
      var $container = $viewport.parent();
      // Add a waiting on load input image
      var $loading = $('<div class="jzac_loading" />');
      $viewport.append($loading);
      // The following procedure hold business intend to be run once the image
      // is loaded (load event).
      var image_load_handler = function(){
        // Add some custom properties to $image
        $.extend($image, {
          scale_proportion_locked: true,
          originalWidth: $image.width(),
          originalHeight: $image.height()
        });
     
        var marginDiffTop = settings.viewportMarginDiffTop;
        var marginDiffLeft = settings.viewportMarginDiffLeft;
               
        var left_crop_set = settings.viewport_content_left;
        var top_crop_set = settings.viewport_content_top;
        
        var main_view_port_height = $("#main_view_port").height();
        var main_view_port_width = $("#main_view_port").width();
        
        var right_crop_set = Math.round( main_view_port_width - $image.width() - left_crop_set);
        var bottom_crop_set = Math.round(($image.height()-(main_view_port_height - top_crop_set))*-1);
        
        // Set given optional image size
        $image.width(settings.image_width).height(settings.image_height);
        settings.zoom_min = $image.width();
        
        if(isNaN(parseInt($(".jzac_viewport").css('margin-top')))) { 
            $(".jzac_viewport").css('margin-top','0px');            
        }        
        // Set the viewport content position for the image
        $image.css({'left': settings.viewport_content_left, 'top': settings.viewport_content_top, 'right':0, 'bottom':0});                
       
        //set the margin for the border-container and display it
        var top_margin = parseInt($(".jzac_viewport").css('margin-top'));
        $(".left_border, .right_border").css('top',marginDiffTop+top_margin+'px');
        $(".right_border").css('margin','0 '+eval(settings.crop_width+($(".right_border").width()))+'px');
        $(".top_border").css('top',marginDiffTop+top_margin+'px');
        $(".bottom_border").css('top',eval(marginDiffTop+settings.crop_height+$(".bottom_border").height()+top_margin)+'px');        
        $(".container-border").css('left',marginDiffLeft);
        $(".border-container").show();

        // Create the zoom widget which permit to resize the image
        if (!jzac_loaded) {
          var $zoom_widget = $('<div class="jzac_zoom_slider"><div class="ui-slider-handle"></div></div>')
          .width($viewport.width())
          .slider({
            value: $image.width(),
            min: settings.zoom_min,
            max: settings.zoom_max,
            start: function(event, ui) {
              $.extend($zoom_widget,{
                on_start_width_value: ui.value,
                on_start_height_value: $image.height()
              })
            },
            slide: function(event, ui) {
              var height = Math.round($zoom_widget.on_start_height_value * ui.value / $zoom_widget.on_start_width_value);
              $image.height(height);
              $image.width(ui.value);
              $viewport.observator.notify('jzac_image_height', height);
              $viewport.observator.notify('jzac_image_width', ui.value);              
            }
          });
          $container.append($zoom_widget);
        
          // Make the viewport resizeable
          if (settings.viewport_resize) {
            $viewport.resizable({
              resize: function(event, ui) {
                $zoom_widget.width(ui.size.width);
              }
            });
          }
          // Enable the image draggable interaction
          $image.draggable({         
            drag: function(event, ui) {
                //console.log($image.width());
                right_crop_set = Math.round( main_view_port_width - $image.width() - left_crop_set);                                
                bottom_crop_set = Math.round(($image.height()-(main_view_port_height - top_crop_set))*-1);
                //console.log(right_crop_set);
                
                if(ui.position.top > top_crop_set)
                {        
                     ui.position.top = top_crop_set;
                }
                if(ui.position.top < bottom_crop_set)
                {        
                     ui.position.top = bottom_crop_set;
                }  
                if(ui.position.left > left_crop_set)
                {        
                    ui.position.left = left_crop_set; 
                }
                if(ui.position.left < right_crop_set)
                {  
                    ui.position.left = right_crop_set; 
                }
                
                if (ui.position.left != ui.originalPosition.left) {
                    $viewport.observator.notify('jzac_crop_x', $viewport.observator.crop_position_x());
                }
                if (ui.position.top != ui.originalPosition.top) {
                    $viewport.observator.notify('jzac_crop_y', $viewport.observator.crop_position_y());
                }
            }
          });

          // Build the crop element
          var $crop = $('<div class="jzac_crop"><div class="jzac_crop_drag_handler"></div></div>')
          .css({
            'width': settings.crop_width,
            'height': settings.crop_height,
            'left':settings.crop_x+settings.viewport_content_left,
            'top':settings.crop_y+settings.viewport_content_top
          }).draggable({
            containment: $viewport,
            handle: 'div.jzac_crop_drag_handler',
            
            drag: function(event, ui) {
                
                 ui.draggable.draggable("disable", 1); 
              if (ui.position.left != ui.originalPosition.left) {
                $viewport.observator.notify('jzac_crop_x', $viewport.observator.crop_position_x());
              }
              if (ui.position.top != ui.originalPosition.top) {
                $viewport.observator.notify('jzac_crop_y', $viewport.observator.crop_position_y());
              }
            }
          });
          if (settings.crop_resize) {
            $crop.resizable({
              containment: $viewport,
              aspectRatio: settings.crop_aspect_ratio,
              resize: function(event, ui) {
                if (ui.size.width != ui.originalSize.width) {
                  $viewport.observator.notify('jzac_crop_width', $crop.width());
                }
                if (ui.size.height != ui.originalSize.height) {
                  $viewport.observator.notify('jzac_crop_height', $crop.height());
                }
              }
            })
          }
          $viewport.append($crop);
        }

        // Extend viewport witch usefull objects as it will be exposed to user
        // functions interface
        $.extend($viewport, {
          $container: $container,
          $image: $image,
          $crop: $crop,
          $zoom_widget: $zoom_widget,
          // Let me introduce the following Terminator's friend which handle the
          // creation of the viewport events.
          observator: {
            items: {},
            // Register an event with a given element
            register: function(event_name, element, onevent_callback) {
              if (event_name && element) {
                this.items[event_name] = {
                  element: element,
                  callback: onevent_callback
                };
              }
            },
            // Unregister an event
            unregister: function(event_name) {
              delete this.items[event_name];
            },
            // Trigger an event and optionally supply a value
            notify: function(event_name, value) {
              if (this.items[event_name]) {
                var element = this.items[event_name].element;
                var onevent_callback = this.items[event_name].callback;
                element.trigger(event_name,[$viewport, value]);
                if ($.isFunction(onevent_callback)) {
                  onevent_callback.call($viewport, event_name, element, value);
                }
              }
              $image.trigger('jzac_events',[$viewport]);
            },
            notify_all: function() {
              this.notify('jzac_crop_x', this.crop_position_x());
              this.notify('jzac_crop_y', this.crop_position_y());
              this.notify('jzac_crop_width', $crop.width());
              this.notify('jzac_crop_height', $crop.height());
              this.notify('jzac_image_width', $image.width());
              this.notify('jzac_image_height', $image.height());
            },
            // Return crop x position relative to $image
            crop_position_x: function() {
              return $crop.position().left - $image.position().left;
            },
            // Return crop y position relative to $image
            crop_position_y: function() {
              return $crop.position().top - $image.position().top;
            },
            // Does the crop is completely inside the image?
            crop_consistent: function() {
              if(this.crop_position_x()>=0 && this.crop_position_y()>=0
              && this.crop_position_x() + $crop.width()<=$image.width()
              && this.crop_position_y() + $crop.height()<=$image.height()) {
                 return true;
              } else {
                 $image.css({'left': 'auto', 'top': 'auto', 'right': settings.viewport_content_left, 'bottom': settings.viewport_content_top});
                 return false;
              }
              //return this.crop_position_x()>=0 && this.crop_position_y()>=0
              //&& this.crop_position_x() + $crop.width()<=$image.width()
              //&& this.crop_position_y() + $crop.height()<=$image.height();
            },
            // Set a property (which his name is one of the event) with a given
            // value then notify this operation
            set_property: function(that, value) {
              value = parseInt(value);
              if (isNaN(value)) {
                return;
              }
              switch (that) {
                case 'jzac_crop_x':
                  $crop.css('left',value + $image.position().left);
                  break;
                case 'jzac_crop_y':
                  $crop.css('top',value + $image.position().top);
                  break;
                case 'jzac_crop_width':
                  $crop.width(value);
                  break;
                case 'jzac_crop_height':
                  $crop.height(value);
                  break;
                case 'jzac_image_width':
                  if ($image.scale_proportion_locked) {
                    var image_height = Math.round($image.height() * value / $image.width());
                    $image.height(image_height);
                    this.notify('jzac_image_height', image_height);
                  }
                  $image.width(value);
                  $zoom_widget.slider('value', value);
                  break;
                case 'jzac_image_height':
                  if ($image.scale_proportion_locked) {
                    var image_width = Math.round($image.width() * value / $image.height());
                    $image.width(image_width);
                    this.notify('jzac_image_width', image_width);
                    $zoom_widget.slider('value', image_width);
                  }
                  $image.height(value);
                  break;
              }
              this.notify(that, value);
            }
          }
        });
        // Hide the loading notice
        $loading.hide();
        $loading.remove();
        // Finally display the image
        $image.show();
        // Trigger the viewport_onload callback
        if ($.isFunction(settings.viewport_onload)) {
          settings.viewport_onload.call($viewport);
          $viewport.observator.notify_all();
        }
      };
      // When an image is using an src image "data" URL scheme then it appear 
      // that the image load event never get fired. Then fire directly
      // image_load_handler() in that case.
      var src = $image.attr('src');
      if (/^data:image/.test(src)) {
        image_load_handler();
      } else {
        src = src + (src.search(/\?/)<0?'?':'&') + 'jzacrandom=' + (new Date()).getTime();
        $('<img>').attr('src', src).load(image_load_handler);
      }
    });
  };
})( jQuery );
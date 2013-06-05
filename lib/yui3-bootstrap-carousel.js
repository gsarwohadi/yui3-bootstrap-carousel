YUI.add('yui3-bootstrap-carousel', function(Y) {
	
	var NS = Y.namespace("Bootstrap");
	
	/*function CarouselPlugin(config)
	{
		CarouselPlugin.superclass.constructor.apply(this, arguments);
	}
	CarouselPlugin.NAME = "Bootstrap.Carousel";
	CarouselPlugin.NS = "carousel";*/
	
	//Y.extend(CarouselPlugin, Y.Plugin.Base, 
	var CarouselPlugin = Y.Base.create("yui3-bootstrap-carousel", Y.Base, [],
	{
		defaults:
		{
			content: ".carousel-inner",
			indicators: ".carousel-indicators",
			interval: 5000,
			pause: "hover",
			direction: "ltr" // ltr or rtl
		},
		
		initializer: function (config)
		{
			this.config = Y.mix(config, this.defaults);
			this.content = this.config.content;
			this.indicators = this.config.indicators;
			
			this.content_node = Y.one(this.content);
			var children = this.content_node.get("children").size();
			var width = this.content_node.one("div").get("clientWidth") + 2;
			this.content_node.setStyle("width", (children * width) + "px");
			
			this.scrollView = new Y.ScrollView(
			{
				id: "scrollview",
				srcNode: this.content,
				width: this.content_node.one("div").get("clientWidth"),
				flick: {
					minDistance:10,
					minVelocity:0.3,
					axis: "x"
				}
			});
			
			this.scrollView.plug(Y.Plugin.ScrollViewPaginator, { selector: "div" });
			this.scrollView.render();
			
			this.on("goTo", this.goTo);
			
			this.indicators_node = Y.one(this.indicators);
			this.active_indicator = this.indicators_node.one(".active");
			this.active_index = this.active_indicator.getAttribute("data-slide-to");
			
			this.indicators_node.all("li").on("click", this.activate, this);
			
			if ( this.config.pause == "hover" )
			{
				this.content_node.on("mouseenter", this.pause, this);
				this.content_node.on("mouseleave", this.cycle, this);
			}
		},
		
		activate: function (e)
		{
			var index = e.target.getAttribute("data-slide-to");
			this.active_index = index;
			this.fire("goTo");
		},
		
		cycle: function (e)
		{
			if (!e) this.paused = false;
			if ( this.interval ) clearInterval(this.interval);
			
			var self = this;
			this.interval = setInterval(function ()
			{
				if ( self.config.direction == "ltr" )
					self.next();
				else
					self.prev();
			}, this.config.interval)
		},
		
		pause: function (e)
		{
			if (!e) this.paused = true;
			clearInterval(this.interval);
			this.interval = null;
		},
		
		next: function ()
		{
			this.active_index++;
			if ( this.active_index >= this.scrollView.pages.get("total") )
				this.active_index = 0;
			
			this.fire("goTo");
		},
		
		prev: function ()
		{
			this.active_index--;
			if ( this.active_index <= 0 )
				this.active_index = this.scrollView.pages.get("total") - 1;
			
			this.fire("goTo");
		},
		
		goTo: function ()
		{
			//this.active_indicator = this.indicators_node.one(".active");
			this.active_indicator.removeClass("active");
			var indicators_child = this.indicators_node.all("li");
			
			this.active_indicator = indicators_child.item(this.active_index);
			this.active_indicator.addClass("active");
			this.scrollView.pages.scrollToIndex(this.active_index);
		}
	});
	
	NS.Carousel = CarouselPlugin;
	
}, '@VERSION@' ,{requires:['scrollview', 'scrollview-paginator', 'node-pluginhost','plugin','event','event-outside']});
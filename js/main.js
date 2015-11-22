(function(){
	//Определяем локальную переменную jQuery
	var $ = jQuery;

	//Модуль автозапуска конструктора опций Лайтбокса
	var simpleLBOptions = (function(){
		function simpleLBOptions(){
			this.slbAround    = false;
			this.slbDuration = 300;
			this.slbResize    = 700;
			this.zipImg = true;
		}
		return simpleLBOptions;
	})();

	//Модуль автозапуска конструктора объекта Лайтбокса и определения его основных свойств и методов
	var simpleLB = (function(){
		function simpleLB(options){
			this.options      = options;
			this.collection   = [];
			this.roundIndex   = 0;
			this.windowWidth  = $(window).innerWidth();
			this.windowHeight = $(window).innerHeight();
			this.topPos       = this.windowHeight * 0.05;
			this.firstImg;
			this.eventHandlers();
			this.buildDOM();
			this.searchElements();
			this.buildEvents();
		}

		//Прототип метода прослушивания событий
		simpleLB.prototype.eventHandlers = function(){
			var self = this;
			//Определение колекции ДОМ объектов с атрибутком "data-simpleLB"
			$('body').on('click', 'a[data-simpleLB]', function(e){
				self.firstImg = $('a[data-simpleLB]').index(this);
				self.startSLB($(e.currentTarget));
				return false;
			});
		};

		//Построение ДОМ структуры Лайтбокса
		simpleLB.prototype.buildDOM = function(){
			var self = this;
			$('body').append('<div id="backgroundSLB" class="backgroundSLB"></div><div id="simpleBox" class="simpleBox"><div id="simpleBoxWrap" class="simpleBoxWrap"><img src="" class="BoxWrapImg" id="BoxWrapImg" /><div id="BoxWrapNav" class="BoxWrapNav"><a href class="chevron-left"><div class="icon-chevron-left"></div></a><a href class="chevron-right"><div class="icon-chevron-right"></div></a></div></div></div>');
		}

		//Поис и привязка ДОМ элементов к свойствам прототипа объекта Лайтбокса
		simpleLB.prototype.searchElements = function(){
			this.backgroundSLB   = $('#backgroundSLB');
			this.simpleBox       = $('#simpleBox');
      this.simpleBoxWrap   = this.simpleBox.find('.simpleBoxWrap');
      this.simpleImage     = this.simpleBoxWrap.find('#BoxWrapImg');
		}

		//Добавление стилизации и добавление событий инициализированным элементам Лайтбокса
		simpleLB.prototype.buildEvents = function(){
			var self = this;
			this.backgroundSLB.hide().on('click', function(){
				self.close();
				return false;
			});
			this.simpleBox.hide().on('click', function(e){
				if($(e.target).attr('id') == "simpleBox"){
					self.close();
				}
				return false;
			});
			if(navigator.userAgent.match(/Android/i)||
	      navigator.userAgent.match(/BlackBerry/i)||
	      navigator.userAgent.match(/iPhone|iPad|iPod/i)||
	      navigator.userAgent.match(/Opera Mini/i)||
	      navigator.userAgent.match(/IEMobile/i)){
					this.simpleBox.find('.chevron-left').on('swiperight', function(){
					if(self.firstImg === 0){
						self.simpleImage.fadeOut('fast');
						self.nextImg(self.collection.length -1);
						self.firstImg = self.collection.length -1;
					}else{
						self.simpleImage.fadeOut('fast');
						self.nextImg(self.firstImg - 1);
						self.firstImg = self.firstImg - 1;
					}
					return false;
				});
				this.simpleBox.find('.chevron-right').on('swipeleft', function(){
					if(self.firstImg === self.collection.length - 1){
						self.simpleImage.fadeOut('fast');
						self.nextImg(0);
						self.firstImg = 0;
					}else{
						self.simpleImage.fadeOut('fast');
						self.nextImg(self.firstImg + 1);
						self.firstImg = self.firstImg + 1;
					}
					return false;
				});
		  }else{
				this.simpleBox.find('.icon-chevron-left').on('click', function(){
					if(self.firstImg === 0){
						self.simpleImage.fadeOut('fast');
						self.nextImg(self.collection.length -1);
						self.firstImg = self.collection.length -1;
					}else{
						self.simpleImage.fadeOut('fast');
						self.nextImg(self.firstImg - 1);
						self.firstImg = self.firstImg - 1;
					}
					return false;
				});
				this.simpleBox.find('.icon-chevron-right').on('click', function(){
					if(self.firstImg === self.collection.length - 1){
						self.simpleImage.fadeOut('fast');
						self.nextImg(0);
						self.firstImg = 0;
					}else{
						self.simpleImage.fadeOut('fast');
						self.nextImg(self.firstImg + 1);
						self.firstImg = self.firstImg + 1;
					}
					return false;
				});
			}

		};

		//Вкл. Лайтбокс
		simpleLB.prototype.startSLB = function(element, index){
			var self = this;
			var winObj = $(window);
			var imgCount = 0;
			this.collection = [];

			self.backgroundSLB.css('display', 'block');
			self.backgroundSLB.animate({'opacity':'0.70'}, self.slbDuration, 'linear');
			self.simpleImage.css('display', 'block');
			self.simpleImage.animate({'opacity':'1.0'}, self.slbDuration, 'linear');
			self.simpleBox.css('display', 'block');
			self.simpleBox.animate({'opacity':'1.0'}, self.slbDuration, 'linear');

			function collectionItAdd(element){
				self.collection.push({link: element.attr('href')});
			};

			var collectionSeparate = element.attr('data-simpleLB');
			var links;

			if(collectionSeparate){
				links = $(element.prop('tagName') + '[data-simpleLB="' + collectionSeparate + '"]');
				for(var i = 0; i < links.length; i++){
					collectionItAdd($(links[i]));
					if(links[i] === element[0]){
						imgCount = i;
					}
				}
			}
			this.simpleImage.attr('src', element.attr('href'));
			if(this.windowWidth < self.simpleImage.width()){
				this.simpleImage.css({'width': this.windowWidth * 0.9  + 'px'});
				this.simpleBoxWrap.css({'width': this.windowWidth * 0.9  + 'px', 'height': self.simpleImage.height()  + 'px'});
			}else if(this.windowHeight < self.simpleImage.height()){
				this.simpleImage.css({'height': this.windowHeight * 0.9  + 'px'});
				this.simpleBoxWrap.css({'height': this.windowHeight * 0.9  + 'px', 'width': self.simpleImage.width()  + 'px'});
			}else{
				this.simpleBoxWrap.css({'height': self.simpleImage.height()  + 'px', 'width': self.simpleImage.width()  + 'px'});
			}



			var positionTop = winObj.scrollTop() + self.topPos;
			this.simpleBox.css({top: positionTop + 'px'});
			//this.simpleBoxWrap.css({'width': self.simpleImage.width() + 'px', 'height': self.simpleImage.height() + 'px'});	
		};

		//Прототип метода "следующее изображение"
		simpleLB.prototype.nextImg = function(imgCount){
			var self = this;
			self.simpleImage.fadeIn('fast');
			this.simpleImage.attr('src', self.collection[imgCount].link);
			if(this.windowWidth < self.simpleImage.width()){
				this.simpleImage.css({'width': this.windowWidth * 0.9  + 'px'});
				this.simpleBoxWrap.css({'width': this.windowWidth * 0.9  + 'px', 'height': self.simpleImage.height()  + 'px'});
			}else if(this.windowHeight < self.simpleImage.height()){
				this.simpleImage.css({'height': this.windowHeight * 0.9  + 'px'});
				this.simpleBoxWrap.css({'height': this.windowHeight * 0.9  + 'px', 'width': self.simpleImage.width()  + 'px'});
			}else{
				this.simpleBoxWrap.css({'height': self.simpleImage.height()  + 'px', 'width': self.simpleImage.width()  + 'px'});
			}
			console.log();

		};
		//Выкл. Лайтбокс
		simpleLB.prototype.close = function(){
			var self = this;
			self.backgroundSLB.animate({'opacity':'0.0'}, self.slbDuration, 'linear', function(){
				self.backgroundSLB.css('display', 'none');
			});
			self.simpleImage.animate({'opacity':'0.0'}, self.slbDuration, 'linear', function(){
				self.simpleImage.css('display', 'none');
			});
			self.simpleBox.animate({'opacity':'0.0'}, self.slbDuration, 'linear', function(){
				self.simpleBox.css('display', 'none');
			});
			
		}
		return simpleLB;
	})();

	//Атосоздание объекта опций и самого лайтбокса
	$(function(){
		var options = new simpleLBOptions();
		var simpleLBObject = new simpleLB(options);
	});
	if(navigator.userAgent.match(/Android/i)||
      navigator.userAgent.match(/BlackBerry/i)||
      navigator.userAgent.match(/iPhone|iPad|iPod/i)||
      navigator.userAgent.match(/Opera Mini/i)||
      navigator.userAgent.match(/IEMobile/i)){
		//$('body').append('<script src="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>');
		$('body').width($(window).innerWidth());
		$('main').width($(window).innerWidth());
		$('.content').width($(window).innerWidth());
		$('.simpleBoxWrap').css({'width': $(window).innerWidth()  + 'px'});
  }
	
})();
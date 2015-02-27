 require('./landing');
 require('./album');
 require('./collection');
 require('./profile');

 // Example album.

 var albumPicasso = {
    name: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: '/images/album-placeholder.png',

    song: [
      { name: 'Blue', length: 163.38, audioUrl: '/music/placeholders/blue' },
      { name: 'Green', length: 105.66 , audioUrl: '/music/placeholders/green' },
      { name: 'Red', length: 270.14, audioUrl: '/music/placeholders/red' },
      { name: 'Pink', length: 154.81, audioUrl: '/music/placeholders/pink' },
      { name: 'Magenta', length: 375.92, audioUrl: '/music/placeholders/magenta' }
    ]
 };
 
var albumPicasso = {
   name: 'The Colors',
   artist: 'Pablo Picasso',
   label: 'Cubism',
   year: '1881',
   albumArtUrl: '/images/album-placeholder.png',
 
   songs: [
       { name: 'Blue', length: '4:26', audioUrl: '/music/placeholders/blue' },
       { name: 'Green', length: '3:14', audioUrl: '/music/placeholders/green' },
       { name: 'Red', length: '5:01', audioUrl: '/music/placeholders/red' },
       { name: 'Pink', length: '3:21', audioUrl: '/music/placeholders/pink' },
       { name: 'Magenta', length: '2:15', audioUrl: '/music/placeholders/magenta' }
     ]
 };

 blocJams = angular.module('BlocJams', ['ui.router']);

  blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
 
    $stateProvider.state('landing', {
      url: '/',
      controller: 'Landing.controller',
      templateUrl: '/templates/landing.html'
    });

    $stateProvider.state('collection', {
      url: '/collection',
      controller: 'Collection.controller',
      templateUrl: '/templates/collection.html'
    });

    $stateProvider.state('album', {
      url: '/album',
      templateUrl: '/templates/album.html',
      controller: 'Album.controller'
    });
  }]);

  blocJams.controller('Collection.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
    $scope.albums = [];

    for (var i = 0; i < 33; i++) {
      $scope.albums.push(angular.copy(albumPicasso));
    }
    $scope.playAlbum = function(album){
      SongPlayer.setSong(album, album.songs[0]);
    }
  }]);

 
 // This is a cleaner way to call the controller than crowding it on the module definition.
 blocJams.controller('Landing.controller', ['$scope', function($scope) {

    $scope.subText = "Turn the music up!";

    $scope.subTextClicked = function() {
 		$scope.subText += '!';
 	};

 	$scope.albumURLs = [
     '/images/album-placeholders/album-1.jpg',
     '/images/album-placeholders/album-2.jpg',
     '/images/album-placeholders/album-3.jpg',
     '/images/album-placeholders/album-4.jpg',
     '/images/album-placeholders/album-5.jpg',
     '/images/album-placeholders/album-6.jpg',
     '/images/album-placeholders/album-7.jpg',
     '/images/album-placeholders/album-8.jpg',
     '/images/album-placeholders/album-9.jpg',
   ];
 }]);

 blocJams.controller('Album.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
  $scope.album = angular.copy(albumPicasso);

    var hoveredSong = null;
    var playingSong = null;

    $scope.onHoverSong = function(song) {
      hoveredSong = song;
    };
    $scope.offHoverSong = function(song) {
      hoveredSong = null;
    };

    $scope.getSongState = function(song) {
      if ( song === playingSong) {
        return 'playing';
      }
      else if (song === hoveredSong) {
        return 'hovered';
      }
      return 'default';
    };

    $scope.playSong = function(song) {
      SongPlayer.setSong($scope.album, song);
      SongPlayer.play();
    };

    $scope.pauseSong = function(song) {
      playingSong = null;
    };
 }]);

 blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer){
  $scope.SongPlayer = SongPlayer;

  $scope.volumeClass = function() {
    return {
      'fa-volume-off': SongPlayer.volume === 0,
      'fa-volume-down': SongPlayer.volume <= 70 && SongPlayer.volume >0,
      'fa-volume-up': SongPlayer.volume > 70
    }
  }

  SongPlayer.onTimeUpdate(function(event, time) {
    $scope.$apply(function(){
      $scope.playTime =time;
    });
  });
 }]);

  blocJams.service('SongPlayer', ['$rootScope', function($rootScope) {
    var currentSongFile = null;
    var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
   };

    return {
      currentSong: null,
      currentAlbum: null,
      playing: false,
      volume: 90,

      play: function() {
        this.playing = true;
        currentSongFile.play();
      },
      pause: function() {
        this.playing = fasle;
        currentSongFile.pause();
      },
      next: function() {
       var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
       currentTrackIndex++;
       if (currentTrackIndex >= this.currentAlbum.songs.length) {
         currentTrackIndex = 0;
       }
       var song = this.currentAlbum.songs[currentTrackIndex];
       this.setSong(this.currentAlbum, song);
     },
     previous: function() {
       var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
       currentTrackIndex--;
       if (currentTrackIndex < 0) {
         currentTrackIndex = this.currentAlbum.songs.length - 1;
       }
 
       this.currentSong = this.currentAlbum.songs[currentTrackIndex];
     },
        seek: function(time) {
          // checks to make sure that a sound file is playing befor seeking
          if(currentSoundFile) {
            // uses a buss method to set the time of the song
            currentSongFile.setTime(time);
          }
        },
        onTimeUpdate: function(callback) {
          return $rootScope.$on('sound:timeupdate', callback);
        },
        setVolume: function(volume) {
          if(currentSoundFile){
            currentSoundFile.setVolume(volume);
          }
          this.volume = volume;
        },
      setSong: function(album, song) {
        if (currentSongFile) {
          currentSongFile.stop();
        }
        this.currentAlbum =album ;
        this.currentSong = song;

        currentSongFile = new buzz.sound(song.audioUrl, {
          formats: [ "mp3" ],
          preload: true
        });

        currentSongFile.setVolume(this.volume);

        currentSongFile.bind('timeupdate', function(e){
          $rootScope.$broadcast('sound:timeupdate', this.getTime());
        });
        this.play();
      }
    };
  }]);
 blocJams.directive('slider', ['$document', function($document){ 
    // Returns a number between 0 and 1 to determine where the mouse event happened along the slider bar.
    var calculatedSliderPercentFromMouseEvent = function($slider, event) {
      var offsetX = event.pageX - $slider.offset().left; // distance from left
      var sliderWidth = $slider.width(); //width of slider
      var offsetXPercent = (offsetX / sliderWidth);
      offsetXPercent = Math.max(0, offsetXPercent);
      offsetXPercent = Math.min(1, offsetXPercent);
      return offsetXPercent;
    };

    blocJams.filter('timecode', function(){
      return function(seconds) {
        seconds = Number.parseFloat(seconds);

        // return when no tims is provided
        if (Number.isNaN(seconds)) {
          return '-:--';
        }

        //make it a whole number
        var wholeSeconds = Math.floor(seconds);

        var minutes = Math.floor(wholeSeconds / 60);

        remainingSeconds = wholeSeconds % 60;

        var output = minutes + ':';

        //zero pad seconds, so 9 seconds should be :09

        if (remainingSeconds < 10) {
          output += '0';
        }
        output += remainingSeconds;

        return output;
      }
    })
  
   }
 var numberFromValue = function(value, defaultValue) {
          if (typeof value === 'number') {
            return value;
          }
          if(typeof value === 'undefined') {
            return defaultValue;
          }
          if(typeof value === 'string'){
            return Number(value);
          }
        }
  return {
    templateUrl: '/templates/directives/slider.html',
    replace: true,
    restrict: 'E',
      scope: {
        onChange: '&'
      },
    link: function(scope, element, attributes) {
      //these values,represent the progress into the song/volume bar, and its max value.
      //for now, we're supplying arbitrary initial an max values
      scope.value = 0;
      scope.max= 100;
      var $seekBar = $(element);

        attributes.$observe('value', function(newValue) {
          scope.value = numberFromValue(newValue, 0);
        });
 
        attributes.$observe('max', function(newValue) {
          scope.max = numberFromValue(newValue, 100) || 100;
        });


        
        var percentString = function (){
          var value = scope.value || 0;
          var max = scope.max || 100;
          percent = value / max *100;
          return percent + "%";
        }

        scope.fillStyle = function() {
          return {width: percentString()};
        }

        scope.thumbStyle = function() {
          return {left: percentString()};
        }
        scope.onClickSlider = function(event) {
          var percent = calculatedSliderPercentFromMouseEvent($seekBar, event);
          scope.value = percent * scope.max;
          notifyCallback(scope.value);
        }
        scope.trackThumb = function() {
          $document.bind('mousemove.thumb', function(event){
            var percent = calculatesSliderPercentFromMouseEvent($seekBar,event);
            scope.$apply(function(){
              scope.value = percent * scope.max;
              notifyCallback(scope.value);
            });
          });

          // cleanup
          $document.bind('mouseup.thumb', function(){
            $document.unbind('mousemove.thumb');
            $document.unbind('mouseup.thumb');
          });
          var notifyCallback = function(newValue) {
            if(typeof scope.onChange === 'function'){
              scope.onChange({value: newValue});
            }
          };
        };
    }
  };
 }]);

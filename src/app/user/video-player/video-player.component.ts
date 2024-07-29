import {Component, Input, OnChanges, OnInit} from '@angular/core';
import * as Plyr from 'plyr';
import { CommonService } from 'src/app/common.service';
import { RestApiService } from 'src/app/rest-api.service';
declare var Hls: any;
declare global {
  interface Window {
    hls: any;
  }
}
@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnChanges{
  @Input() source = '';
  @Input() duration: number = 0;
  @Input() lessonId: number = 0;
  @Input() unitId: number = 0;
  @Input() courseId: number = 0;
  hls: any;
  player: any;
  customInterval = 5; // Interval in seconds
  constructor(private rest: RestApiService, private common: CommonService) {
  }

  ngOnChanges(): void {
    console.log('onchange ', this.source, this.duration);
    if(window.hls) {
      window.hls.detachMedia()
      window.hls.destroy()
    }
    if(this.hls) {
      this.hls.detachMedia();
      this.hls.destroy();
    }
    if(this.player) {
      this.player.destroy();
    }
    if(this.source  != '') {
      const video: any = document.querySelector("video");
      if(video) {
        video.src = '';
        video.autoplay = true;
        const defaultOptions: any = {};
        if (Hls.isSupported()) {
          // For more Hls.js options, see https://github.com/dailymotion/hls.js
          this.hls = new Hls();
          this.hls.loadSource(this.source);

          // From the m3u8 playlist, hls parses the manifest and returns
          // all available video qualities. This is important, in this approach,
          // we will have one source on the Plyr player.
          this.hls.on(Hls.Events.MANIFEST_PARSED, (event: any, data: any) => {

            // Transform available levels into an array of integers (height values).
            const availableQualities = this.hls.levels.map((l: any) => l.height)

            // Add new qualities to option
            defaultOptions.quality = {
              default: availableQualities[0],
              options: availableQualities,
              // this ensures Plyr to use Hls to update quality level
              forced: true,
              onChange: (e: any) => this.updateQuality(e),
            };
            // defaultOptions.duration = 0;
            // Initialize here
            this.player = new Plyr(video, defaultOptions);
            this.player.on('loadeddata', () => {
              this.player.currentTime = this.duration;
            })
          });
          this.hls.attachMedia(video);
          // this.hls.play();
          window.hls = this.hls;

          let previousTime = 0; // Variable to keep track of the previously logged time
          const hitCounter = () => {
              const currentTime = video.currentTime
              if (currentTime >= previousTime + this.customInterval) {
                previousTime = Math.floor(currentTime / this.customInterval) * this.customInterval;
                console.log('previousTime >> ', previousTime)
                this.addStatistic(previousTime)
              }
          }
          try{
            video.removeEventListener('timeupdate', ()=>{});
          } catch(e) {}
          video.addEventListener('timeupdate', () => {
            let currentTime = video.currentTime
            hitCounter()
          });
        } else {
          // default options with no quality update in case Hls is not supported
          defaultOptions.duration = 0;
          const player = new Plyr(video, defaultOptions);
        }
      }
    }
  }

  addStatistic(duration: number = 0) {
    const data = {
      userid: this.common.getUserId(),
      courseid: this.courseId,
      lessionid: this.lessonId,
      unitid: this.unitId,
      duration: duration
    };
    this.rest.addStatistic(data).subscribe((res: any) => {});
  }

  updateQuality(newQuality: any) {
    window.hls.levels.forEach((level: any, levelIndex: any) => {
      if (level.height === newQuality) {
        console.log("Found quality match with " + newQuality);
        window.hls.currentLevel = levelIndex;
      }
    });
  }
}

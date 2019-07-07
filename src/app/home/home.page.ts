import { Component } from '@angular/core';

declare var microgear;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public temperature:any = "25";
  public humidity:any = "70";
  public status:any = false;
  public timeString = "";

  constructor() {
    this.timemer();
    this.InitMicrogear();
  }

  public switch () {
    microgear.publish("/cpe/switch",`${this.status}`);
  }

  public InitMicrogear(){
    microgear.on('message',(topic: String,msg: String) =>{
      if(topic == "/IONICAPPLICATION/cpe/dht"){
        this.temperature = msg.split(",")[0];
        this.humidity = msg.split(",")[1];
      }
      console.log(`${topic} -> ${msg.split(",")[0]}`);
      
    });


    microgear.on('connected', () => {
      microgear.subscribe("/cpe/+");
      console.log("เชื่อมต่อสำเร็จ");
    });

    microgear.on('present',(event:any) => {
      console.log(event);
    });
  
    microgear.on('absent', (event:any) => {
      console.log(event);
    });
  }

public timemer(){
  setInterval(()=>{
    let time = new Date();
    this.timeString = `${this.zeroPad(time.getHours())}:${this.zeroPad(time.getMinutes())}:${this.zeroPad(time.getSeconds())}`;
  },1000);
}

private zeroPad(nr,base = 10){
  var  len = (String(base).length - String(nr).length)+1;
  return len > 0? new Array(len).join('0')+nr : nr;
}

public getTime(time:any){
  let dt = new Date(time)
  //console.log(dt.getHours() + " " + dt.getMinutes());
  microgear.publish("/cpe/time",`${dt.getHours()}:${dt.getMinutes()}`);
  //microgear.publish("/cpe/min",`${dt.getMinutes()}`);
}

}


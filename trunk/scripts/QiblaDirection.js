function QiblaDirection() {
	
	
	this.qiblaLat = 21;
	this.qiblaLong = 40;
	
	
}

QiblaDirection.prototype.calculate = function(location)
{
	
	var result = {};
	
	result.range = .621371192237 * this.calculateRange(location);
	result.azimuth = this.calculateAzimuth(location);
	result.azimuthMag = this.calculateAzimuthMag(location, result.azimuth);
	result.mercator = this.calcMercator(location);
	result.mercatorMag = this.calculateAzimuthMag(location, result.mercator);
	
	return result;	
	
}

QiblaDirection.prototype.calcMercator = function (location) {
	
	var lat1 = location.latitude;
	var lat2 = this.qiblaLat;
	var lon1 = location.longitude;
	var lon2 = this.qiblaLong;
	
	var dLon = (lon2-lon1).toRad();
	var dPhi = Math.log(Math.tan(lat2.toRad()/2+Math.PI/4)/Math.tan(lat1.toRad()/2+Math.PI/4));
	if (Math.abs(dLon) > Math.PI) dLon = dLon>0 ? -(2*Math.PI-dLon) : (2*Math.PI+dLon);
	return Math.atan2(dLon, dPhi).toBrng();

	
}

QiblaDirection.prototype.calculateRange = function range(location) {
	
	var hlong = location.longitude;
	var hlat = location.latitude;
	var dlong = this.qiblaLong;
	var dlat = this.qiblaLat;
	
	dong=hlong-dlong;
	r1=57.29577951308*Math.acos(Math.cos(dong/57.29577951308)*Math.cos(dlat/57.29577951308)
	           *Math.cos(hlat/57.29577951308)
	           +Math.sin(hlat/57.29577951308)*Math.sin(dlat/57.29577951308));
	// 111.15 amended to 111.226264 on 11/9/2004 
	r2=111.226264*r1;
	return r2;
}

QiblaDirection.prototype.calculateAzimuth = function (location) {
	
	var hlong = 1.0*location.longitude;
	var hlat = 1.0*location.latitude;
	var dlong = 1.0*this.qiblaLong;
	var dlat = 1.0*this.qiblaLat;

	
	//outward azimuth angle
	dl=720.0-1.0*dlong;
	hl=720.0-1.0*hlong;
	dong=dl-hl;

	if (Math.abs(dong)>180){
	// crosses 180 line in pacific
	    if ((dlong<0) && (hlong>0)) dlong=1.0*dlong+360;
	    if ((hlong<0) && (dlong>0)) dlong=1.0*dlong-360;
	    dl=720.0-1.0*dlong;
	    hl=720.0-1.0*hlong;
	    dong=dl-hl;
	}
	r=Math.acos(Math.cos(dong/57.29577951308)*Math.cos(dlat/57.29577951308)*Math.cos(hlat/57.29577951308)
	  +Math.sin(hlat/57.29577951308)*Math.sin(dlat/57.29577951308));
	t1=Math.sin(dlat/57.29577951308)-Math.cos(r)*Math.sin(hlat/57.29577951308);
	b1=Math.sin(r)*Math.cos(hlat/57.29577951308);
	//return t1/b1;
	t=t1/b1;
	if (t>1) t=1;
	if (t<-1) t=-1;
	az=Math.acos(t);
	azd=az*57.29577951308;
	if (hl<dl) 
		azi=360.0-azd;
	else 
		azi=azd;
	return azi;
}

QiblaDirection.prototype.calculateAzimuthMag = function(location,az) {
	latit=1.0*location.latitude;
	longi=1.0*location.longitude;
	az=1.0*az;
	//az=0;
	//return az;
	
	//magnetic field model
	//table below updated 17 Apr 2006, centered on 17 April 2007, needs updating in Apr 2008 to keep errors under 0.2 deg
	dev = new Array(65);
	dev[0]=4.58;     dev[1]=7.21;    dev[2]=9.58;    dev[3]=16.48;   dev[4]=46.03;
	dev[5]=19.52;    dev[6]=12.2;   dev[7]=9.28;    dev[8]=17.25;   dev[9]=42.62;
	dev[10]=21.9;   dev[11]=12.42;  dev[12]=9.13;   dev[13]=16.83;    dev[14]=38.92;
	dev[15]=-8.28;   dev[16]=0.33;  dev[17]=4.61;   dev[18]=13.92;    dev[19]=28.95;
	dev[20]=-28.45;  dev[21]=-16.08; dev[22]=-14.6;dev[23]=-8.15;  dev[24]=10.55;
	dev[25]=-18.72; dev[26]=-11.45;dev[27]=-18.7;dev[28]=-24.13; dev[29]=-5.7;
	dev[30]=-3.5;   dev[31]=-0.98;  dev[32]=-6.43; dev[33]=-23.5; dev[34]=-19.32;
	dev[35]=9.12;   dev[36]=3.32;  dev[37]=0.63; dev[38]=-23.92;   dev[39]=-39.95;
	dev[40]=16.42;   dev[41]=2.18;  dev[42]=-4.15; dev[43]=-32.12; dev[44]=-60.65;
	dev[45]=7.9;   dev[46]=0.02;  dev[47]=-2.48; dev[48]=-18.33;dev[49]=-73.8;
	dev[50]=-12.8; dev[51]=-4.8;  dev[52]=1.08;   dev[53]=-0.77; dev[54]=-62.3;
	dev[55]=-11.35;  dev[56]=-2.65;  dev[57]=5.5;   dev[58]=11;    dev[59]=39.35;
	dev[60]=4.58;    dev[61]=7.21;   dev[62]=9.58;   dev[63]=16.48;  dev[64]=46.03;
	
	if (latit==60.0) latit=59.99999;
	if (latit >59.999999) return "n/a";
	if (latit <-60) return "n/a";
	if (longi==180.0) longi=179.99999;
	if (longi>179.999999) longi=longi-360;
	if (longi<-180) longi=longi+360;
	a = Math.round(((1.0*longi + 180)/30)-0.5);
	b = 3- Math.round(((1.0*latit + 60)/30)-0.5);
	c=a * 5 + b;
	//calculate left proportion up to 30.
	if (latit>=30) pl=latit-30;
	else
	if(latit>=0) pl=latit;
	else
	if (latit>=-30) pl=30+latit;
	else
	pl = 60+latit;
	//calculate horiz proportion up to 30.
	pr=longi +180 - a*30;
	//return pr;   ok to here
	u1=dev[c+1]+(dev[c]-dev[c+1])*pl/30;
	u2=dev[c+6]+(dev[c+5]-dev[c+6])*pl/30;
	um=u1+(u2-u1)*pr/30;
	azm=az-um;
	if (azm<-180) azm=azm+360; 
	if (azm>360)  azm=azm-360.0;
	return azm;
}
Number.prototype.toRad = function() {  // convert degrees to radians
  return this * Math.PI / 180;
}

Number.prototype.toDeg = function() {  // convert radians to degrees (signed)
  return this * 180 / Math.PI;
}

Number.prototype.toBrng = function() {  // convert radians to degrees (as bearing: 0...360)
  return (this.toDeg()+360) % 360;
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

// extend Number object with methods for presenting bearings & lat/longs

Number.prototype.toDMS = function() {  // convert numeric degrees to deg/min/sec
  var d = Math.abs(this);  // (unsigned result ready for appending compass dir'n)
  d += 1/7200;  // add ½ second for rounding
  var deg = Math.floor(d);
  var min = Math.floor((d-deg)*60);
  var sec = Math.floor((d-deg-min/60)*3600);
  // add leading zeros if required
  if (deg<100) deg = '0' + deg; if (deg<10) deg = '0' + deg;
  if (min<10) min = '0' + min;
  if (sec<10) sec = '0' + sec;
  return deg + '\u00B0' + min + '\u2032' + sec + '\u2033';
}

Number.prototype.toLat = function() {  // convert numeric degrees to deg/min/sec latitude
  return this.toDMS().slice(1) + (this<0 ? 'S' : 'N');  // knock off initial '0' for lat!
}

Number.prototype.toLon = function() {  // convert numeric degrees to deg/min/sec longitude
  return this.toDMS() + (this>0 ? 'E' : 'W');
}

Number.prototype.toPrecision = function(fig) {  // override toPrecision method with one which displays 
  if (this == 0) return 0;                      // trailing zeros in place of exponential notation
  var scale = Math.ceil(Math.log(this)*Math.LOG10E);
  var mult = Math.pow(10, fig-scale);
  return Math.round(this*mult)/mult;
}

var qiblaDirection = new QiblaDirection();

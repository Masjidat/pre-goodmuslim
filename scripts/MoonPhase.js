function MoonPhase() {
	var jd=0;
}

MoonPhase.prototype.jdn = function() {
  var now_date = new Date();
  zone = now_date.getTimezoneOffset() / 1440;

  var mm = now_date.getMonth() + 1;

  var dd = now_date.getDate();
  
  var yy = now_date.getFullYear();

   with (Math) {
     var yyy=yy;
     var era=1;
         if (era == 0) yyy = 1 - yy
     var mmm = mm;
     if (mm < 3) {
       yyy = yyy - 1;
       mmm = mm + 12;
       }
     var day = dd + zone + 0.5;
     var a = floor(yyy/100);
     var b = 2 - a + floor(a/4);
     this.jd = floor(365.25*yyy) + floor(30.6001*(mmm+1)) + day + 1720994.5;
     if (this.jd > 2299160.4999999) this.jd = this.jd + b;
     }
}

MoonPhase.prototype.proper_ang = function(big)
{
with (Math)
{
var tmp = 0;
if (big > 0)
{
tmp = big / 360.0;
tmp = (tmp - floor(tmp)) * 360.0;
}
else
{
tmp = ceil(abs(big / 360.0));
tmp = big + tmp * 360.0;
}
}
return tmp;
}

//
// ---------------------------------------------------------------------
//
MoonPhase.prototype.moonElong = function() {
   with (Math) {
   var dr = PI / 180
   var rd = 1 / dr 
   var meeDT = pow((this.jd - 2382148), 2) / (41048480*86400)
   var meeT = (this.jd + meeDT - 2451545.0) / 36525
   var meeT2 = pow(meeT,2)
   var meeT3 = pow(meeT,3)
   var meeD = 297.85 + (445267.1115*meeT) - (0.0016300*meeT2) + (meeT3/545868)
       meeD = this.proper_ang(meeD) * dr
   var meeM1 = 134.96 + (477198.8676*meeT) + (0.0089970*meeT2) + (meeT3/69699)
       meeM1 = this.proper_ang(meeM1) * dr
   var meeM = 357.53 + (35999.0503*meeT)
       meeM = this.proper_ang(meeM) * dr
   var elong = meeD*rd + 6.29*sin(meeM1)
       elong = elong   - 2.10*sin(meeM)
       elong = elong   + 1.27*sin(2*meeD - meeM1)
       elong = elong   + 0.66*sin(2*meeD)
       elong = this.proper_ang(elong)
       elong = round(elong)
   var moonNum = ((elong + 6.43) / 360) * 28
       moonNum = floor(moonNum)
       if (moonNum == 28) moonNum = 0
       if (moonNum < 10) moonNum = "0" + moonNum
   var moonImage = "images/moon/moon" + moonNum.toString() + ".gif"
   }
   var moonPhase = " new Moon"
     if ((moonNum>3) && (moonNum<11)) moonPhase = " first quarter"
     if ((moonNum>10) && (moonNum<18)) moonPhase = " full Moon"
     if ((moonNum>17) && (moonNum<25)) moonPhase = " last quarter"
  
     if ((moonNum==1)||(moonNum==8)||(moonNum==15)||(moonNum==22)) {
           moonPhase = " 1 day past" + moonPhase
           }
     if ((moonNum==2)||(moonNum==9)||(moonNum==16)||(moonNum==23)) {
           moonPhase = " 2 days past" + moonPhase
           }
     if ((moonNum==3)||(moonNum==10)||(moonNum==17)||(moonNum==24)) {
           moonPhase = " 3 days past" + moonPhase
           }
     if ((moonNum==4)||(moonNum==11)||(moonNum==18)||(moonNum==25)) {
           moonPhase = " 3 days before" + moonPhase
           }
     if ((moonNum==5)||(moonNum==12)||(moonNum==19)||(moonNum==26)) {
           moonPhase = " 2 days before" + moonPhase
           }
     if ((moonNum==06)||(moonNum==13)||(moonNum==20)||(moonNum==27)) {
           moonPhase = " 1 day before" + moonPhase
           }

  
    return {
		"moonImage": moonImage,
		"moonNum": moonNum,
		"moonPhase": moonPhase
	};    
}

MoonPhase.prototype.calculate = function () {
	this.jdn();
	return this.moonElong();
}

var moonPhase = new MoonPhase();

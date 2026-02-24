// subroutine to demonstrate what 'confidence' in an interval means

function CI_demo_Divs(){
  var div1, div2, div3;
  div1 = 	"<div class=w3-container> "+
     " 	<form class='w3-cell w3-card w3-padding-small'>" +
       " 	<h4>Confidence Level</h4>" +
       " 	<div class='w3-bar'>" +
       " 		<input class='w3-radio' type='radio' name='CIdemo_conf' value='80%' " +
       "     onClick='confidence = .80; drawCI(BootCount);'>" +
         " 	<label>80%</label>" +
         " 	<input class='w3-radio' type='radio' name='CIdemo_conf' value='90%' " +
         "   onClick='confidence = .90; drawCI(BootCount);'>" +
       " 		<label>90%</label>" +
       " 		<br>" +
         " 	<input class='w3-radio' type='radio' name='CIdemo_conf' value='95%' " +
         "   onClick='confidence = .95; drawCI(BootCount);' checked='checked'>" +
       " 		<label>95%</label>" +
         " 	<input class='w3-radio' type='radio' name='CIdemo_conf' value='99%' " +
         "   onClick='confidence = .99; drawCI(BootCount);'>" +
         " 	<label>99%</label>" +
         " </div>" +
       " </form>" +
       " <div class='w3-btn w3-cell '></div>" +
       " <form class='w3-cell w3-card w3-padding-small' oninput='nn.value=parseInt(CIdemo_n.value)'>" +
       " 	Sample Size: (number of spins)" +
       " 	<div class='w3-bar'>" +
       " 		20" +
       " 		<input id='slide_CI_n' type='range' name='CIdemo_n' min='20' max='100' step='5' value='50' " +
       "     onchange='updateCIdemo_n(this.value);' />" +
       " 		100" +
       " 		<br>" +
       " 		n = <output name='nn' for='CIdemo_n'></output>" +
       " 	</div>" +
     " 	</form>" +
     " 	<div class='w3-btn w3-cell'></div>" +
     " 	<form class='w3-cell w3-card w3-padding-small' oninput='pp.value=CIdemo_p.value'>"  +
     " 		<h4>True Proportion Successes:</h4>" +
     " 		<div class='w3-bar'>" +
     " 			0" +
       " 		<input id='slide_CI_p' type='range' name='CIdemo_p' min='0' max='1' step='.05' value='.5' " +
       "     onchange='updateCIdemo_p(this.value);' />" +
       " 		1" +
       " 		<br>" +
       " 		p = <output name='pp' for='CIdemo_p'></output>" +
       " 	</div>" +
       " </form>" +
     " </div>";
     div2 = " ";
     div3 = " ";
return [div1, div2, div3];
}

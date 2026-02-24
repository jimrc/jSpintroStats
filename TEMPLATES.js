/**
 * HTML Template Functions for JSpin statistical tool
 * Centralized location for all inline HTML templates
 * Updated: February 2026
 */

const TEMPLATES = {
  /**
   * Categorical 1-variable data input template
   * Creates form for entering categorical data with labels and counts
   */
  cat1DataInput: () => {
    return `<div class='w3-cell-row w3-mobile'>
     <div class='w3-cell' style='width:40%'>
       <h4> Enter Data</h4>
       <table class='w3-table w3-border'>
         <tr> <th>Label</th> <th>Count</th></tr>
         <tr> <td>	<input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat1Label1'
           placeholder='Success' ></td>
           <td><input class='w3-input  w3-mobile w3-pale-yellow' type='text' id='cat1N1'
             placeholder=' '   onchange= 'renewC1()'>  </td>  </tr>
         <tr> 	<td>	<input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat1Label2'
           placeholder='Failure' ></td>	
           <td><input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat1N2'
             placeholder=' '  onchange= 'renewC1()'> 	</td></tr> <tr></tr>
       </table>	&nbsp; &nbsp;
     </div>        	&nbsp; &nbsp; 				&nbsp; &nbsp;
     <div class='w3-cell' style='width:2%'> </div>
     <div class='w3-cell' style='width:45%; display:block'>
       <button onclick = 'summarizeP1()'>   &nbsp &nbsp  Summary</button>
       <div class='w3-container w3-cell w3-mobile' id='cat1SummaryText' style='display:none'>
         p&#770; =
         &nbsp; &nbsp;
         se(p&#770;) =
       </div>
       <div class='w3-container w3-cell w3-mobile' id='cat1SummarySVGgoesHere'> </div>
       <br>
     </div>  </div>`;
  },

  /**
   * Categorical 1-variable test inputs template
   * Creates form for hypothesis test parameters
   */
  cat1TestInputs: () => {
    return `<div class='w3-cell-row w3-mobile' style='margin-bottom: 15px;'>
    <div class='w3-cell w3-mobile' style='width: 48%'>
      <button class='w3-button w3-blue w3-round' onclick='AppState.inference = "estimate"; document.getElementById("testInpt").style.display = "none"; document.getElementById("confLvlInpt").style.display = "block";'>Estimate Proportion (CI)</button>
    </div>
    <div class='w3-cell w3-mobile' style='width: 4%'></div>
    <div class='w3-cell w3-mobile' style='width: 48%'>
      <button class='w3-button w3-lightblue w3-round' onclick='AppState.inference = "test"; document.getElementById("confLvlInpt").style.display = "none"; document.getElementById("testInpt").style.display = "block";'>Test Proportion</button>
    </div>
   </div>
   <div id='cat1TestInputsDiv' style='display:none'>
    <div class='w3-cell-row w3-mobile'>
      <div class='w3-cell  w3-mobile' style='width: 55%'>
        &nbsp; &nbsp; &nbsp; Test: Is the true proportion = &nbsp;
      </div>
      <div class='w3-cell  w3-mobile' style='width: 35%'>
        <input class='w3-input w3-card w3-mobile w3-pale-yellow' type='text' id='cat1Null'
          placeholder='0.625' 	onchange= 'AppState.nullValue = +this.value; changeNullC1();' 
        ></input>
       </div>
     </div>
     <div id='c1TestDirection' class='w3-cell-row w3-mobile' >
       <div class='w3-cell' >
         Stronger evidence is a proportion
       </div>
       <div class='w3-cell'>
         <select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow'  onchange='AppState.testDirection = this.value; if(AppState.sample4Test.length > 0){moreTests(0,true)} else{moreTests(100,false)}'>
           <option value='lower'>Less Than or =</option>
           <option value='both' selected>As or More Extreme Than</option>
           <option value='upper'>Greater Than or =</option>
         </select>
       </div>
       <div class='w3-cell' style='width: 30%'>
         &nbsp;	&nbsp; 	p&#770; (from above)
       </div>
     </div>
     <div class='w3-cell-row w3-mobile' style='margin-top: 10px;'>
       <button class='w3-button w3-blue w3-round' onclick='AppState.inference = "test"; moreTests(100, false)'>Get Test Samples (100)</button>
     </div>
   </div>
 </div>`;
  },

  /**
   * Category 2-variable data input template
   * Creates form for entering two-group categorical data
   */
  cat2DataInput: () => {
    return `<div class='w3-container' id='cat2DataIn-Summary'>
    <div class='w3-cell-row w3-mobile'>
      <div class='w3-cell' style='width:50%'>
        <h4> Enter Data as counts, then click [Summary]. </h4>
        <table class='w3-table w3-border'>
          <tr>
            <th>Labels:</th>
            <th>
              <input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat2LabelPop1' 
                placeholder='Group A'  onchange='AppState.cat2Label1 = this.value; renewC2()'>
            </th>
            <th>
              <input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat2LabelPop2'
                 placeholder='Group B'  onchange='AppState.cat2Label2 = this.value; renewC2()'>
            </th>
          </tr>
          <tr>
            <td>
              <input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat2LabelOut1' 
                         placeholder='Success'  onchange='AppState.cat2LabelOut1 = this.value; renewC2()'>
            </td>
            <td>
            <input class='w3-input  w3-mobile w3-pale-yellow' type='text' id='cat2N11' 
            placeholder='1' onchange='renewC2()'>
            </td>
            <td>
              <input class='w3-input  w3-mobile w3-pale-yellow' type='text' id='cat2N12'
               placeholder='1' onchange='renewC2()'>
            </td>
          </tr>
          <tr>
            <td>
              <input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat2LabelOut2'
               placeholder='Failure'  onchange='AppState.cat2LabelOut2 = this.value; renewC2()'>
            </td>
            <td>
              <input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat2N21'
               placeholder='1' onchange='renewC2()'>
            </td>
            <td>
              <input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat2N22' 
              placeholder='1' onchange='renewC2()'>
            </td>
          </tr>
        </table>
      </div>
      &nbsp;&nbsp;
      <div class='w3-cell' style='display:block'>
          <button id='cat2RawSumm' class='w3-button w3-pale-blue w3-medium w3-round-xlarge'
            onclick='AppState.sample4CI = []; AppState.testData = []; summarizeP2(); '> 
             &nbsp; &nbsp;Summary
             </button>
        <div class='w3-container w3-cell w3-mobile' id='cat2SummarySVGgoesHere' 
        style = 'display:none'></div>
        <div class='w3-container w3-cell w3-mobile' id='cat2SummaryText' 
        style='width:310px; display:none'></div>
      </div>
    </div>
    <br>
  </div>`;
  },

  /**
   * Quantitative 2-variable data selection dropdown
   * Choose from built-in datasets
   */
  q2DataInput: () => {
    return `<div class='w3-cell' style='width:50%'>
      <h4> Choose Data: </h4>
      <select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='quant2DataName'
         onselect='q2DataChange()' onmouseup='q2DataChange()'>
        <option value='shuttle' selected>Shuttle</option>
        <option value='women'>Women rate men</option>
        <option value='men'>Men rate women</option>
        <option value='dental'>Dental distance</option>
        <option value='other'>Other</option>
      </select>
    </div>`;
  },

  /**
   * Categorical 1 + Quantitative 1 data input template
   * Choose from difference in means datasets
   */
  c1q1DataInput: () => {
    return `<div class='w3-container' id='C1Q1DataIn-Summary'>
    <div class='w3-cell-row w3-mobile' id='C1Q1Data'>
      <div class='w3-cell' style='width:20%'>
        <h4> Choose Data</h4>
      </div>
      <select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='C1Q1DataName'
        onselect='c1q1DataChange()' onmouseup='c1q1DataChange()'>
        <option value='SATprep' selected>SAT prep</option>
        <option value='smoker'>Smoking - Birthweight</option>
        <option value='music1'>Music vs Silence</option>
        <option value='REDAvsCntrl'>REDA vs Control</option>
        <option value='REDvsREDA'>RED vs REDA</option>
        <option value='other'>Other</option>
      </select>
      <div class='w3-cell'></div>
    </div>
  </div>`;
  },

  /**
   * Category 1 + Quant 1 test inputs template
   * Choice buttons between estimate and test modes with test direction selector
   */
  c1q1TestInputs: () => {
    return `<div class='w3-row-padding w3-margin-bottom' id='inferenceInputs'>
    <button class='w3-button w3-blue w3-round' onclick='AppState.inference = "estimate"; DOM.setState({testInpt: "hide", confLvlInpt: "show"}); d3.select("#infSVGplot_svg").remove();'>
      Estimate Difference (CI)
    </button>
    <button class='w3-button w3-lightblue w3-round' onclick='AppState.inference = "test"; DOM.setState({testInpt: "show", confLvlInpt: "hide"}); d3.select("#infSVGplot_svg").remove();'>
      Test Difference
    </button>
  </div>
  <div id='testInpt' style='display:none'>
    <div><br></div>
    <div class='w3-cell-row w3-mobile' style = 'text-align: left'>
      <div class='w3-cell' style='width:250px'>
        Test: Are the two means equal?
      </div>
    </div>
    <div><br></div>
    <div class='w3-cell-row w3-mobile'>
      <div class='w3-cell' style='width: 250px'>
        Stronger evidence is a difference
      </div>
      <div class='w3-cell' style='width: 30%'>
        <select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='c1q1testDirection'
          onmouseup='AppState.testDirection = this.value; if(AppState.sample4Test && AppState.sample4Test.length > 0){moreTests(0,true)} else{moreTests(100,false)}'>
          <option value='lower'>Less Than or =</option>
          <option value='both' selected>As or More Extreme Than</option>
          <option value='upper'>Greater Than or =</option>
        </select>
      </div>
      <div class='w3-cell' style='width: 40%' id='c1q1Obsd'>
        &nbsp;&nbsp; the observed difference = value above
      </div>
    </div>
    <button class='w3-button w3-blue w3-round' onclick='AppState.inference = "test"; moreTests(100, false)'>
      Get Test Samples (100)
    </button>
  </div>`;
  },

  /**
   * Quantitative 1-variable data input template
   * Creates form for entering quantitative data with label and values
   */
  q1DataInput: () => {
    return `<div class='w3-container' id='quant1DataIn-Summary'>
		<div class='w3-cell-row w3-mobile'>
			<div class='w3-cell' style='width:60%'>
				<h4> Enter Data</h4>
				<table class='w3-table w3-border'>
					<tr>
						<th>Label</th>
						<th>Separate values with commas</th>
					</tr>
					<tr>
						<td>
							<input class='w3-input w3-mobile w3-pale-yellow' type='text' id='q1Label' placeholder='y'>
						</td>
						<td>
							<input class='w3-input  w3-mobile w3-pale-yellow' type='text' id='q1Values'
							  onchange = 'q1DataChange();' >
						</td>
					</tr>
				</table>
			</div>
			<div class='w3-cell'> &nbsp;
				<button onclick = 'summarizeMu1()'>  &nbsp; &nbsp; Summary</button>
				<div class='w3-cell' style=' display:block' id='q1Summary'>
					<div class='w3-container w3-cell w3-mobile' id='q1SummaryText' style='width:70%'>
					</div>
					<div class='w3-container w3-cell w3-mobile' id='q1SummarySVGgoesHere'>
						<svg id='q1SmrySVG' height=160 width=300></svg>
					</div>
					<div class='w3-container w3-modal w3-mobile'>
						<div class='w3-modal-content w3-card-4' id='q1SelectedSampleA' style=' display:none'>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`;
  },

  /**
   * Quantitative 1-variable data input template
   * Creates form for entering quantitative data with label and values
   */
  q1DataInput: () => {
    return `<div class='w3-container' id='quant1DataIn-Summary'>
		<div class='w3-cell-row w3-mobile'>
			<div class='w3-cell' style='width:60%'>
				<h4> Enter Data</h4>
				<table class='w3-table w3-border'>
					<tr>
						<th>Label</th>
						<th>Separate values with commas</th>
					</tr>
					<tr>
						<td>
							<input class='w3-input w3-mobile w3-pale-yellow' type='text' id='q1Label' placeholder='y'>
						</td>
						<td>
							<input class='w3-input  w3-mobile w3-pale-yellow' type='text' id='q1Values'
							  onchange = 'q1DataChange();' >
						</td>
					</tr>
				</table>
			</div>
			<div class='w3-cell'> &nbsp;
				<button onclick = 'summarizeMu1()'>  &nbsp; &nbsp; Summary</button>
				<div class='w3-cell' style=' display:block' id='q1Summary'>
					<div class='w3-container w3-cell w3-mobile' id='q1SummaryText' style='width:70%'>
					</div>
					<div class='w3-container w3-cell w3-mobile' id='q1SummarySVGgoesHere'>
						<svg id='q1SmrySVG' height=160 width=300></svg>
					</div>
					<div class='w3-container w3-modal w3-mobile'>
						<div class='w3-modal-content w3-card-4' id='q1SelectedSampleA' style=' display:none'>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`;
  },

  /**
   * Quantitative 1-variable test inputs template
   * Creates form for hypothesis test on mean
   */
  q1TestInputs: () => {
    return `<div class='w3-cell-row w3-mobile' style='margin-bottom: 15px;'>
    <div class='w3-cell w3-mobile' style='width: 48%'>
      <button class='w3-button w3-blue w3-round' onclick='AppState.inference = "estimate"; document.getElementById("testInpt").style.display = "none"; document.getElementById("confLvlInpt").style.display = "block";'>Estimate Mean (CI)</button>
    </div>
    <div class='w3-cell w3-mobile' style='width: 4%'></div>
    <div class='w3-cell w3-mobile' style='width: 48%'>
      <button class='w3-button w3-lightblue w3-round' onclick='AppState.inference = "test"; document.getElementById("confLvlInpt").style.display = "none"; document.getElementById("testInpt").style.display = "block";'>Test Mean</button>
    </div>
   </div>
   <div id='q1TestInputsDiv' style='display:none'>
    <div> <br> </div>
    <div class='w3-cell-row w3-mobile' style = 'text-align: left'>
      	<div class='w3-cell' style='width:250px'>
      		Test: Is the true mean = &nbsp;
      	</div>
      	<div class='w3-cell' style='width: 30%'>
      		<input class='w3-input w3-card w3-mobile w3-pale-yellow' type='text' id='q1trueMu'
                 placeholder='0.0' 	onchange= 'AppState.nullValue = +this.value; changeNullQ1();' >
             </div>
    </div>
    <div> <br> </div>
    <div class='w3-cell-row w3-mobile'>
        <div class='w3-cell' style='width: 250px' >	Stronger evidence is a mean 	</div>
    	<div class='w3-cell' style='width: 30%'>
    		<select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='q1testDirection' 
             onmouseup ='AppState.testDirection = this.value; if(AppState.sample4Test.length > 0){moreTests(0,true)} else{moreTests(100,false)}'>
              <option value='lower'>Less Than or =</option>
    			<option value='both' selected >As or More Extreme Than</option>
    			<option value='upper'>Greater Than or =</option>
            </select>
    	</div>
    	<div class='w3-cell' style='width: 40%' id='q1ObsdMean'>
          &nbsp;&nbsp; the observed mean = 0
        </div>
    </div>
    <div class='w3-cell-row w3-mobile' style='margin-top: 10px;'>
      <button class='w3-button w3-blue w3-round' onclick='AppState.inference = "test"; moreTests(100, false)'>Get Test Samples (100)</button>
    </div>
   </div>`;
  },

  /**
   * Proportion CI demo explanation template
   * Provides educational text about confidence intervals
   */
  propCIDemoExplanation: () => {
    return `<p> On this page we pretend that we know the true proportion, <b>p</b>. <br> 
   We generate random data using a spinner with probability <b>p</b> 
   of getting an '<b>a</b>' and probability <b>1 - p</b> of getting a '<b>z</b>'.
    Then we estimate <b>p</b> to see how well our methods perform.
   <br>A confidence interval estimate 'succeeds' if the interval contains the true <b>p</b> 
    in which case it intersects the vertical line at <b>p</b>.
   <br> When analyzing data (real world), we only build a single confidence interval, but in this fantasy land
    where <b>p</b> is known, we can repeat the process and get another interval, and another and another....
   <br> By changing inputs, you will see that an interval might include the true value or it might not.
   <br> Setting a higher confidence has a price: it lengthens intervals making them less informative. 
    The 'Confidence Level' is the proportion of all such intervals which capture 
    the true value in the long run.</p>`;
  },

  /**
   * Proportion CI demo input table template
   * Creates form for CI demo parameters
   */
  propCIDemoInputs: () => {
    return `<table class='w3-container' style='width: 60% border-collapse: collapse'>
   <tr class='w3-border' style='width: 60% border-collapse: collapse'>
      <td  class='w3-cell' style='width: 60% display:block'>
           Number of intervals to create: 	</td>
   	<td><input class='w3-input  w3-cell w3-mobile w3-padding-large' 
            style='width:40%' type='text' id='nRepsInput' value='10'
						 onchange='nn= +this.value; pCIPlot(nn)'> </td>
   </tr>
   <tr class='w3-border'>
     <td class='w3-cell' style='width: 60% display:block'>
	           True Proportion: </td>
   	<td><input class='w3-input  w3-cell  w3-mobile w3-padding-large' 
            style='width:40%' type='text' id='truePInpt' value=0.45
						 onchange='trueP = +this.value; pCIPlot(nn)'> </td></tr>
   <tr class='w3-border'>
     <td  class='w3-cell' >
           Number of spins (sample size):	</td>
   	<td><input class='w3-input  w3-cell w3-mobile w3-padding-large' 
            style='width:40%' type='text' id='nSpinsInpt' value='20'
						 onchange='nSpins= +this.value; pCIPlot(nn)'> </td></tr>
   <tr class='w3-border'>
         <td class='w3-cell' >
           Confidence Level % (between 50 and 100):	</td>
   	     <td><input class='w3-input  w3-cell w3-mobile w3-padding-large' 
            style='width:40%' type='text' id='clInpt' value='90'
            onchange='confLvl= +this.value; changeCL(confLvl)'>
     </td></tr>
  </table>`;
  },

  /**
   * Placeholder div for plot area
   */
  plotPlaceholder: (id) => `<div id='${id}'> </div>`,

  /**
   * Placeholder div for results display
   */
  resultsPlaceholder: (id) => `<div id='${id}'> Results </div>`,

  /**
   * Empty template for spacer/placeholder
   */
  empty: () => `<div> </div>`,

  /**
   * Mix box setup and configuration template
   */
  mixSetup: () => {
    return `<p>	Setup: In the first box, type labels separated by commas. 
 		In the second box, type a number of balls for each label, again, separated by commas.	</p> 
 	<div class=' w3-cell-row w3-mobile' id='mixInputs'> 
 		<div class='w3-cell w3-mobile' style='width:30%'> 
 			Labels: 
 			<input class='w3-input w3-border w3-mobile w3-pale-yellow' type='text' id='mixCats'  
       style='display:block' onchange='restartMix();' > 
 		</div> 
 		<div class='w3-cell w3-mobile'></div> 
 		<div class='w3-cell w3-mobile' style='width:30%'> 
 			Numbers of balls: 
 			<input class='w3-input w3-border w3-mobile w3-pale-yellow' type='text' id='mixNs'  
       style='display:block' onchange='restartMix();' > 
 		</div> 
 		<div class='w3-cell w3-mobile' style='width:40%'> 
 			Replace drawn balls? 
 			<select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='mix_Replace' onblur = 'restartMix(); initialMixState()'> 
 				<option value='yes'>Yes</option> 
 				<option value='no'>No</option> 
 			</select> 
 		</div> 
 	</div>`;
  },

  /**
   * Mix stop conditions template
   */
  mixStopConditions: () => {
    return `<div>Stop after:</div>
 	<div class='w3-cell-row w3-mobile' id='mixStops'> 
 		<div class='w3-cell w3-mobile' style='width:30%'> 
 			<input class='w3-input w3-border w3-mobile w3-pale-blue ' type='text' id='nDraws'  
       placeholder='This many draws:' onchange='restartMix(); mixNtimes(this.value)' style='display:block'> 
 		</div> 
 		&nbsp; or&nbsp; 
 		<div class='w3-cell w3-mobile' style='width:30%'> 
  			<input class='w3-input w3-border w3-mobile w3-pale-blue ' type='text' id='mixTil'  
       placeholder='Getting one of this type: ' onchange='restartMix(); mixTill1();' style='display:block'> 
 		</div> &nbsp; or &nbsp; 
 		<div class='w3-cell w3-mobile' style='width:30%'> 
 			<button id='mixAllButton' onclick='restartMix(); mixTillAll()' class='w3-button w3-pale-blue w3-medium w3-round-xlarge'> 
 				&nbsp;  Getting one of EACH type. 
 			</button> 
 		</div> 
 	</div>`;
  },

  /**
   * Mix visualization area template
   */
  mixVisualArea: () => {
    return `<br> 
 	<div class='w3-cell-row w3-mobile' style='display:block'> 
 		<div class='w3-container w3-cell w3-mobile' id='mixSVGgoesHere' style = 'width = 550px'> </div>
 		<div class='w3-cell w3-mobile'> 
 			<button onclick='hideShowMix()' class='w3-button w3-pale-green w3-medium w3-round-xlarge'> 
 				&nbsp; Hide / Show 
 			</button>  <br>
      <div class='w3-cell w3-mobile' id = 'whichType'> </div>  
 	</div>`;
  },

  /**   * Category 2-variable test inputs template
   * Creates form for testing difference in proportions
   */
  cat2TestInputs: () => {
    return `<div class='w3-cell-row w3-mobile' style='margin-bottom: 15px;'>
    <div class='w3-cell w3-mobile' style='width: 48%'>
      <button class='w3-button w3-blue w3-round' onclick='AppState.inference = "estimate"; document.getElementById("testInpt").style.display = "none"; document.getElementById("confLvlInpt").style.display = "block";'>Estimate Difference (CI)</button>
    </div>
    <div class='w3-cell w3-mobile' style='width: 4%'></div>
    <div class='w3-cell w3-mobile' style='width: 48%'>
      <button class='w3-button w3-lightblue w3-round' onclick='AppState.inference = "test"; document.getElementById("confLvlInpt").style.display = "none"; document.getElementById("testInpt").style.display = "block";'>Test Difference</button>
    </div>
   </div>
   <div id='cat2TestInputsDiv' style='display:none'>
    <div class='w3-cell-row w3-mobile'>
      <div class='w3-cell  w3-mobile' style='width: 55%'>
        &nbsp; &nbsp; &nbsp; Test H <sub>0</sub>: The true proportions are equal.
      </div>
    </div>
    <div id='c2TestDirection' class='w3-cell-row w3-mobile' >
      <div class='w3-cell' >
        Stronger evidence is a difference in proportions
      </div>
      <div class='w3-cell'>
        <select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow'  onchange='AppState.testDirection = this.value; AppState.nullValue = 0.0; if(AppState.sample4Test.length > 0){moreTests(0,true)} else{moreTests(100,false)}'>
          <option value='lower'>Less Than or =</option>
          <option value='both' selected>As or More Extreme Than</option>
          <option value='upper'>Greater Than or =</option>
        </select>
      </div>
      <div class='w3-cell' id='cat2ObsdDiff'>
        &nbsp;&nbsp;
        the p&#770;<sub>1</sub> - p&#770;<sub>2</sub> observed above.
      </div>
    </div>
    <div class='w3-cell-row w3-mobile' style='margin-top: 10px;'>
      <button class='w3-button w3-blue w3-round' onclick='AppState.inference = "test"; moreTests(100, false)'>Get Test Samples (100)</button>
    </div>
   </div>`;
  },

  /**
   * Quantitative 2-variable test inputs template
   * Creates form for testing regression slope
   */
  q2TestInputs: () => {
    return `<div class='w3-cell-row w3-mobile' style='margin-bottom: 15px;'>
    <div class='w3-cell w3-mobile' style='width: 48%'>
      <button class='w3-button w3-blue w3-round' onclick='AppState.inference = "estimate"; document.getElementById("testInpt").style.display = "none"; document.getElementById("confLvlInpt").style.display = "block";'>Estimate Slope (CI)</button>
    </div>
    <div class='w3-cell w3-mobile' style='width: 4%'></div>
    <div class='w3-cell w3-mobile' style='width: 48%'>
      <button class='w3-button w3-lightblue w3-round' onclick='AppState.inference = "test"; document.getElementById("confLvlInpt").style.display = "none"; document.getElementById("testInpt").style.display = "block";'>Test Slope</button>
    </div>
   </div>
   <div id='q2TestInputsDiv' style='display:none'>
    <div class='w3-cell-row w3-mobile' style='text-align: left'>
      <div class='w3-cell' style='width:250px'>
        Test: Is the true slope zero?
      </div>
    </div>
    <div class='w3-cell-row w3-mobile'>
      <div class='w3-cell' style='width: 250px' >Stronger evidence is a slope</div>
      <div class='w3-cell' style='width: 30%'>
        <select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='q2testDirection' onmouseup='AppState.testDirection = this.value; if(AppState.sample4Test.length > 0){moreTests(0,true)} else{moreTests(100,false)}'>
          <option value='lower'>Less Than or =</option>
          <option value='both' selected>As or More Extreme Than</option>
          <option value='upper'>Greater Than or =</option>
        </select>
      </div>
      <div class='w3-cell' style='width: 30%' id='q2ObsdSlope'>
        &nbsp;&nbsp; observed β&#770;<sub>1</sub> = value above
      </div>
    </div>
    <div class='w3-cell-row w3-mobile' style='margin-top: 10px;'>
      <button class='w3-button w3-blue w3-round' onclick='AppState.inference = "test"; moreTests(100, false)'>Get Test Samples (100)</button>
    </div>
   </div>`;
  },

  /**   * Mix repeat trials template
   */
  mixRepeatTrials: () => {
    return `<div id='repeatMixer' class='w3-container' style='display:none'>
			<div class='w3-cell-row'>
      	  	<div class='w3-cell  w3-mobile' style='width: 20%'>  Show results of &nbsp;</div>
			<div class='w3-cell  w3-mobile' style='width: 20%'>
 			<input class='w3-input w3-mobile w3-pale-yellow' type='text' id='moreMixPoints' 
      placeholder='0' onclick='mixRepeat(this.value); dotChart2(mixRepResults );' 
 				 onchange='mixRepeat(this.value); dotChart2(mixRepResults );'>
 		</div>
 		<div class='w3-cell  w3-mobile' style='width: 80%'>
 		&nbsp; (more)	trials
 		</div>
    </div> 
 	</div>
    <div class='w3-container w3-cell w3-mobile' id='mixSmrySVGdiv'> </div> 
    <div class='w3-container w3-mobile' id='mixSmryCount'> </div>`;
  },
};

// Make TEMPLATES globally available
if (typeof window !== 'undefined') {
  window.TEMPLATES = TEMPLATES;
}

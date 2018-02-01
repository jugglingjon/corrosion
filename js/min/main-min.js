function shuffle(e){var t,a,s;for(s=e.length;s;s--)t=Math.floor(Math.random()*s),a=e[s-1],e[s-1]=e[t],e[t]=a}function numberWithCommas(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}function toDashes(e){return e.replace(" ","-")}function toSpaces(e){return e.replace("-","")}function startQuestionTimer(){$startTime=Date.now(),$(".game-timer-bar-inner").animate({width:"0%"},$questionTime,"linear"),$(".game-timer-time").text($questionTime/1e3),$textTimer=setInterval(function(){$(".game-timer-time").text($(".game-timer-time").text()-1)},1e3),$questionTimer=setTimeout(function(){$(".game-answers").addClass("clicked"),$(".answer").off("click"),clearInterval($textTimer),advanceGame()},$questionTime)}function reportQuestionTimer(){var e=Date.now()-$startTime;return e}function changeScreen(e,t){$lastScreen=$currentScreen,$currentScreen=e;var a=$(".screen:not(."+e+")"),s=a.length;a.fadeOut($globalFadeTime,function(){--s>0||(t&&t.before&&t.before(),$("."+e).fadeIn($globalFadeTime,function(){t&&t.after&&t.after()}))})}function updateLocalData(){localStorage[$localKey]=JSON.stringify($data)}function loadData(e){if(localStorage[$localKey]&&!e){var t=JSON.parse(localStorage[$localKey]);init(t)}else e&&(alert("Reseting Data"),localStorage.removeItem($localKey),changeScreen("screen-categories",{before:populateCategories})),$.getJSON("categories.json",function(e){init(e)})}function processAchievements(callback){$(".modal-achievements-list").empty(),$.each($data.achievements,function(){var criteria=this.criteria;if(eval(criteria.stat+criteria.operator+criteria.threshold)&&!this.complete){this.complete=!0,this.completedOn=Date.now();var newAchievement='<div class="modal-achievement"><div class="achievement-content"><h1>Achievement Unlocked</h1><div class="achievement-wrapper"><div class="achievement-image-wrapper"><img src="achievements/'+this.slug+'.png"></div><h2 class="achievement-title">'+this.title+'</h2><p class="achievement-description">'+this.description+"</p></div></div></div>";$(newAchievement).appendTo(".modal-achievements-list")}}),$(".modal-achievement").length&&$("#achievementsModal").modal().one("shown.bs.modal",function(){$(".modal-achievements-list").flickity({prevNextButtons:!1,pageDots:!1}),$(".modal-achievements-list").animate({opacity:"1"},$globalFadeTime)}),callback()}function populateAchievements(){$(".achievements-list").empty(),$.each($data.achievements,function(){var e=this.complete?this.slug:"lock",t='<div class="achievement" data-complete="'+this.complete+'"><div class="achievement-image-wrapper"><img src="achievements/'+e+'.png"></div><span class="achievement-title">'+this.title+'</span><span class="achievement-description">'+this.description+"</span></div>";$(t).appendTo(".achievements-list")})}function cloneGameData(){$gameData.push($(".game-data").clone())}function endGame(){$gameScore=$gameBonusScore+$gameCorrectScore,$(".correct-score").text(numberWithCommas($gameCorrectScore)),$(".correct-score-count").text($gameCorrectCount),$(".correct-score-total").text($gameLength),$(".bonus-score").text(numberWithCommas($gameBonusScore)),$(".end-score").text(numberWithCommas($gameScore)),$(".end-history").empty(),$.each($gameData,function(){this.appendTo(".end-history")}),$categories[$currentCategory].lastScore=$gameScore,$categories[$currentCategory].highScore<$gameScore&&($categories[$currentCategory].highScore=$gameScore),$categories[$currentCategory].cumulativeScore+=$gameScore,$categories[$currentCategory].played++,$data.stats.gamesPlayed++,$data.stats.cumulativeScore+=$gameScore,$data.stats.correctScore+=$gameCorrectScore,$data.stats.bonusScore+=$gameBonusScore,$data.stats.fastAnswers+=$gameFastAnswers,$gameScore===($bonusScore+$correctScore)*$gameLength&&$data.stats.perfectGames++,processAchievements(updateLocalData),changeScreen("screen-end",{after:function(){$(".end-history").flickity({prevNextButtons:!1,pageDots:!1}),$(".end-history").animate({opacity:"1"})}})}function advanceGame(){window.setTimeout(function(){cloneGameData(),$(".screen-game").fadeOut($globalFadeTime,function(){$(".game-timer-time").text($questionTime/1e3),$(".game-timer-bar-inner").css("width","100%"),$(".game-answers").removeClass("clicked"),$(".game-image").hide(),$(".game-question-wrapper").show(),$currentQuestion<$gameLength-1?($currentQuestion++,loadQuestion($currentQuestion)):endGame()})},$answerDisplayDelay)}function loadQuestion(e){var t=$categories[$currentCategory].questions[e];$(".game-category").text($categories[$currentCategory].title),$(".game-question").text(t.question),t.image&&($(".game-image").show().attr("style","background-image: url(categories/"+$categories[$currentCategory].slug+"/"+t.image+")"),$(".game-question-wrapper").hide()),$(".game-answers").empty(),$.each(t.answers,function(){var e=$('<a href="#" class="answer"><span class="answer-text">'+this.answer+"</span></a>");this.correct&&e.addClass("correct"),e.appendTo(".game-answers")}),$(".game-answers").randomize(".answer"),$(".game-progress-dot").removeClass("current past").eq(e).addClass("current"),$(".game-progress-dot:lt("+e+")").addClass("past"),$(".screen-game").fadeIn($globalFadeTime,function(){startQuestionTimer(),$(".answer").click(function(){$(this).addClass("clicked"),$(".game-answers").addClass("clicked"),clearInterval($textTimer),$(".answer").off("click");var e=reportQuestionTimer();if(window.clearTimeout($questionTimer),$(".game-timer-bar-inner").stop(),$(this).hasClass("correct")){$gameCorrectCount++,$gameCorrectScore+=$correctScore;var a=0;e<=$bonusBuffer?a=$bonusScore:e>$bonusBuffer&&e<=$questionTime&&(a=Math.floor(($questionTime-$bonusBuffer-(e-$bonusBuffer))/($questionTime-$bonusBuffer)*$bonusScore)),$gameBonusScore+=a,e<$fastAnswerTime&&$gameFastAnswers++,t.complete=!0,updateLocalData()}advanceGame()})})}function playGame(){$currentQuestion=0,$gameScore=0,$gameCorrectCount=0,$gameCorrectScore=0,$gameFastAnswers=0,$gameBonusScore=0,$gameData=[],$(".game-timer-time").text($questionTime/1e3),$(".game-progress-dots").empty();for(var e=0;e<$gameLength;e++)$(".game-progress-dots").append($('<div class="game-progress-dot"></div>'));shuffle($categories[$currentCategory].questions),loadQuestion($currentQuestion)}function isComplete(e){"string"==typeof e&&$.each($categories,function(t){this.slug===e&&(e=t)});var t=$categories[e].questions,a=0,s,i;return $.each(t,function(){this.complete&&a++}),i=a/t.length,s=1===i,{percentage:i,boolean:s,complete:a,total:t.length}}function populateStats(){$(".stats-latest-achievements-list,.stats-categories-list").empty();var e=0,t=0,a=0,s=0,i=[];$.each($data.achievements,function(){this.complete&&(e++,i.push(this))}),i.sort(function(e,t){return parseFloat(t.completedOn)-parseFloat(e.completedOn)});var o=i.slice(0,4);$.each(o,function(){$('<div class="latest-achievement"><div class="latest-achievement-image"><img src="achievements/'+this.slug+'.png" class="img-responsive"></div><h4 class="lastest-achievement-label" style="display:none;">'+this.title+"</h4></div>").appendTo(".stats-latest-achievements-list")}),$.each($categories,function(e){var i=isComplete(e);i.boolean&&s++,t+=i.complete,a+=i.total;var o='<div class="stat-category"><div class="stat-category-icon"><img src="categories/'+this.slug+'/icon.png" class="img-responsive"></div><div class="stat-category-content"><h3>'+this.title+'</h3><div class="category-data"><div class="category-complete clearfix"><span class="category-complete-label">Questions Completed</span><span class="category-complete-number">'+Math.ceil(100*i.percentage)+'%</span></div><div class="category-progress"><div class="category-progress-inner" style="width:'+100*i.percentage+'%"></div></div><div class="category-stats clearfix"><div class="category-stat"><h3>'+this.played+'</h3><h4>Times Played</h4></div><div class="category-stat"><h3>'+numberWithCommas(this.highScore)+'</h3><h4>High Score</h4></div><div class="category-stat"><h3>'+numberWithCommas(this.lastScore)+"</h3><h4>Last Score</h4></div></div></div></div></div>";$(o).appendTo(".stats-categories-list")}),$(".stats-cumulative-stat-played").text($data.stats.gamesPlayed),$(".stats-cumulative-stat-achievements").text(e),$(".stats-cumulative-stat-perfect").text($data.stats.perfectGames),$(".stats-cumulative-stat-completed").text(s),$(".stats-questions-completed-inner").css("width",t/a*100+"%")}function populateCategories(){var e=[];$(".categories-list").isotope("destroy"),$(".categories-list,.modal-categories-list").empty(),$.each($categories,function(t){var a=$.map(this.tags,function(t){return e.indexOf(t)===-1&&e.push(t),toDashes(t)}),s=100*isComplete(t).percentage,i='<a href="#" class="category" data-categoryIndex="'+t+'" data-tags="'+a.join(" ")+'"><div class="category-image-wrapper"><img src="categories/'+this.slug+'/icon.png"></div><span class="category-title">'+this.title+'</span><div class="category-progress"><div class="category-progress-inner" style="width:'+s+'%"></div></div></a>';$(i).appendTo(".categories-list");var o='<div class="modal-category"><div class="category-image-wrapper"><img src="categories/'+this.slug+'/icon.png"></div><h2 class="category-title">'+this.title+'</h2><p class="category-description">'+this.description+'</p><div class="category-data"><div class="category-complete clearfix"><span class="category-complete-label">Questions Completed</span><span class="category-complete-number">'+Math.ceil(s)+'%</span></div><div class="category-progress"><div class="category-progress-inner" style="width:'+s+'%"></div></div><div class="category-stats clearfix"><div class="category-stat"><h3>'+this.played+'</h3><h4>Times Played</h4></div><div class="category-stat"><h3>'+numberWithCommas(this.highScore)+'</h3><h4>High Score</h4></div><div class="category-stat"><h3>'+numberWithCommas(this.lastScore)+'</h3><h4>Last Score</h4></div></div></div><a href="#" data-categoryIndex="'+t+'" class="btn btn-primary modal-category-play">Play</a></div>';$(o).appendTo(".modal-categories-list")}),$(".tag-select").empty(),$(".tag-select").append($('<option value="">All Topics</option>')),$.each(e,function(){$(".tag-select").append($('<option value="'+toDashes(this)+'">'+this+"</option>"))}),$categoryGrid=$(".categories-list").isotope(),$(".categories-list").animate({opacity:"1"},$globalFadeTime)}function init(e){$data=e,$categories=$data.categories,populateCategories()}function failAlert(){alert("Unable to connect to Zendesk service, please connect to a wireless network and restart the app")}var $data,$categories,$categoryGrid,$globalFadeTime=500,$currentCategory,$gameScore=0,$gameBonusScore=0,$gameCorrectScore=0,$gameCorrectCount=0,$gameFastAnswers=0,$fastAnswerTime=5e3,$currentQuestion=0,$consecutiveGames=0,$gameLength=10,$questionTime=15e3,$answerDisplayDelay=750,$bonusBuffer=3e3,$correctScore=100,$bonusScore=100,$gameData=[],$localKey="corrosionTriviaData",$currentScreen="screen-categories",$lastScreen="screen-categories",$version="2.6",$startTime,$questionTimer,$textTimer;$.fn.randomize=function(e){return(e?this.find(e):this).parent().each(function(){$(this).children(e).sort(function(){return Math.random()-.5}).detach().appendTo(this)}),this},$(document).ready(function(){$(".footer").append($(' <a href="#" id="zendeskLink" onclick="failAlert();">Feedback</a>')),zE(function(){zE.hide(),$("#zendeskLink").attr("onclick","zE.activate({hideOnClose: true});")}),$("#version").append(" v"+$version+" "),localStorage.newCorrosionUser||($("#disclaimerModal").modal({backdrop:"static",keyboard:!1}),$("#disclaimer").on("hidden.bs.modal",function(){}),localStorage.newCorrosionUser=!0),FastClick.attach(document.body),loadData(),$(".categories-list").on("click",".category",function(){var e=parseInt($(this).attr("data-categoryIndex"));$("#categoriesModal").modal().one("shown.bs.modal",function(){$(".modal-categories-list").flickity({prevNextButtons:!1,pageDots:!1,initialIndex:e}),$(".modal-categories-list").animate({opacity:"1"},$globalFadeTime)})}),$(".tag-select").change(function(){var e=$(this).val();e?$categoryGrid.isotope({filter:"[data-tags*="+e+"]"}):$categoryGrid.isotope({filter:"*"})}),$("#categoriesModal").on("hidden.bs.modal",function(){$(".modal-categories-list").flickity("destroy"),$(".modal-categories-list").css("opacity","0")}),$("body").on("click",".modal-category-play",function(){$("#categoriesModal").modal("hide"),$currentCategory=parseInt($(this).attr("data-categoryIndex")),$consecutiveGames=1,changeScreen("screen-game",{before:playGame})}),$("body").on("click",".btn-gameover",function(){changeScreen("screen-categories",{before:function(){$(".end-history, .modal-achievements-list").flickity("destroy").empty().css("opacity","0"),$(".categories-list").css({opacity:"0"})},after:function(){populateCategories()}})}),$("body").on("click",".btn-restart",function(){changeScreen("screen-game",{before:function(){$(".end-history, .modal-achievements-list").flickity("destroy").empty().css("opacity","0"),$consecutiveGames++,playGame()}})}),$(".nav-achievements").click(function(){changeScreen("screen-achievements",{before:populateAchievements})}),$(".nav-stats").click(function(){changeScreen("screen-stats",{before:populateStats})}),$(".nav-categories").click(function(){changeScreen("screen-categories")}),$(".nav-back").click(function(){changeScreen($lastScreen)}),$(".stats-reset").click(function(){loadData(!0)})});
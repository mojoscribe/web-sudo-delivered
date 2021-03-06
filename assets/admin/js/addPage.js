var htmlarea;
var selectedColor = "#1abc9c";
$(document).ready(function(){
	
	
	var articleId = 0;
	var articleId = decodeURI((RegExp('id=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]);
	if(articleId == 'null') {
		articleId = 0;
	}
	
	var attachmentHTML = '';
	
	$("#article-title").focusout(function(){
		if(articleId == 0) {
			savePage('NEW');
		}
	});
	
	$("#edit-article").htmlarea({
		toolbar: [
		          	["bold", "italic", "underline", "strikethrough", "|", "subscript", "superscript"],
			        ["increasefontsize", "decreasefontsize"],
			        ["orderedlist", "unorderedlist"],
			        ["indent", "outdent"],
			        ["justifyleft", "justifycenter", "justifyright"],
			        ["link", "unlink", "image", "horizontalrule"],
			        ["p", "h1", "h2", "h3", "h4", "h5", "h6"],
			        ["cut", "copy", "paste"],
			        [
		              {
		                  // The CSS class used to style the <a> tag of the toolbar button
		                  css: 'add-attachment',

		                  // The text to use as the <a> tags "Alt" attribute value
		                  text: 'Add/Insert Attachment file',

		                  // The callback function to execute when the toolbar button is clicked
		                  action: function (btn) {
		                      // 'this' = jHtmlArea object
		                      // 'btn' = jQuery object that represents the <a> ("anchor") tag for the toolbar button
		                	  $('#myModal').modal('show');
		                	  var txtArea = this;
		                	  $("#insert-into-post").click(function(e){
		                			e.preventDefault();
		                			$('#myModal').modal('hide');
		                			 
		                			txtArea.pasteHTML(attachmentHTML);
		                			 
		                	  });
		                  }
		              }
		             ]
		      ]
	});
	
	$('.jHtmlArea iframe').css({
		border: '1px solid #ccc'
	});
	
	$('#attachment-form-submit').click(function(e){
		e.preventDefault();
		uploadFile();
	});
	
	$(".insert-attachment").click(function(e){
//		e.preventDefault();
		//$('.add-attachment').trigger('click');
		
		 $('#myModal').modal('show');
	});
	
	$("#submit-article").click(function(e){		
		e.preventDefault();
		savePage('ADMIN_REVIEW');
		
	});
	
	$("#save-draft").click(function(e){
		e.preventDefault();
		savePage('DRAFT');
	});
	
	$(".color").click(function(e){
		e.preventDefault();
		$(".color").each(function(){
			$(this).removeClass('selected');
		});
		$(this).addClass('selected');
		selectedColor = "#" + $(this).attr('id');
	});
	
	function uploadFile() {
		$(".attachment-upload-form").css('opacity','0.7');
		$("#progress-bar-parent").show();
		var data = new FormData();
		data.append('file',document.getElementById("attachment").files[0]);
		data.append('attachment-type',$('#attachment-type').val());
		data.append('article-id',articleId);
		var xhr = new XMLHttpRequest();
		xhr.upload.addEventListener('progress', function(e) {
			var percentage = 0;
			if (e.lengthComputable) {
				percentage = Math.round((e.loaded * 100) / e.total);
			}
	        //console.log(percentage);
	        $("#upload-progress").css("width","" + percentage + "%");
	    }, false);
		
		xhr.open("POST", base_url + "/pages/upload");  
		xhr.send(data);
		xhr.onreadystatechange=function(){
			if (xhr.readyState==4 && xhr.status==200){
				$(".attachment-upload-form").css('opacity','1');
				$("#progress-bar-parent").hide();
				//console.log(xhr.responseText);
				var response = $.parseJSON(xhr.responseText);
				//console.log(response.data);
				attachmentHTML = response.data.attachmentHTML;
		    	
		    	$("#insert-into-post").show();
			}
		}
	}
	
	function savePage(status){
		var title = $("#article-title").val();
		var content = $("#edit-article").val();
		var excerpt = $("#excerpt").val();
		var category = $('#article-category').val();
		console.log(category);
		
		if(articleId == 0) {
			var data = {title: title, content: content, status: status, color: selectedColor, excerpt: excerpt, category:category};
		} else {
			var data = {title: title, content: content, status: status, id: articleId, color: selectedColor, excerpt: excerpt, category:category};
		}
		
		$.ajax({
			url: base_url + '/pages/savePage',
			type: 'POST',
			data: data,
			success: function(response){
				console.log(response);
				
//				$("#slug").html(response.data.slug);
				
				articleId = response.data.id;
				
					window.location = base_url + '/pages/pageList';
				
			},
			error: function (xhr, ajaxOptions, thrownError) {
				console.log(xhr);
		        console.log(thrownError);
			}
		});
	}
	
	var autoSave = function(){
		console.log('Saving..');
	}
//	var color = $("#color-val").val();
//	console.log(color);
	
	if($("#color-val").val() != "") {
		$('.color').each(function(){
		});
	}
}); //end of doc ready
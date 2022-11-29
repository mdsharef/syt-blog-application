
window.onload = function() {

    //** tinymce version-6 image upload handler : */

    const local_image_upload_handler_v6 = (blobInfo, progress) => new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', '/uploads/postimage');
      
        xhr.upload.onprogress = (e) => {
          progress(e.loaded / e.total * 100);
        };
      
        xhr.onload = () => {
          if (xhr.status === 403) {
            reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
            return;
          }
      
          if (xhr.status < 200 || xhr.status >= 300) {
            reject('HTTP Error: ' + xhr.status);
            return;
          }
      
          const json = JSON.parse(xhr.responseText)
      
          if (!json || typeof json.imgUrl != 'string') {
            reject('Invalid JSON: ' + xhr.responseText);
            return;
          }
      
          resolve(json.imgUrl);
        };
      
        xhr.onerror = () => {
          reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
        };
      
        const formData = new FormData();
        formData.append('post-image', blobInfo.blob(), blobInfo.filename());
      
        xhr.send(formData);
      });

      //** tinymce version-5 image upload handler */

      const local_image_upload_handler_v5 = (blobInfo, success, failure) => {
        let headers = new Headers();
        headers.append('Accept', 'Application/JSON')

        let formData = new FormData();
        formData.append('post-image', blobInfo.blob(), blobInfo.filename())

        let req = new Request('/uploads/postimage', {
            method: 'POST',
            headers,
            body: formData,
            mode: 'cors'
        });

        fetch(req)
            .then(res => res.json())
            .then(data => success(data.imgUrl))
            .catch(() => failure('HTTP Error!'))

      }

    tinymce.init({
        selector: 'textarea#tiny-mce-post-body',
        plugins: 'a11ychecker advcode advlist lists link checklist autolink autosave code linkchecker preview searchreplace wordcount media table emoticons image imagetools editimage mediaembed advtable pageembed casechange export formatpainter permanentpen powerpaste tableofcontents tinymcespellchecker',
        toolbar: 'undo bold italic underline styles | alignleft aligncenter alignright alignjustify subscript superscript | bullist numlist outdent indent addcomment showcomments | forecolor backcolor emoticons | link image media | code codesample ltr rtl preview fullscreen searchreplace',
        toolbar_mode: 'wrap',
        height: 350,
        media_live_embeds: true,
        automatic_uploads: true,
        images_upload_url: '/uploads/postimage',
        images_upload_handler: local_image_upload_handler_v6,  // version-6 has been used in this case and version-5 just has been implemented
        relative_urls: false,
        remove_script_host: false
    });
}


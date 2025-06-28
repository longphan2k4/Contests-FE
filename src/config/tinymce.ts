// Import TinyMCE core
import 'tinymce/tinymce';

// Import theme
import 'tinymce/themes/silver';

// Import icons
import 'tinymce/icons/default';

// Import plugins cơ bản
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/code';
import 'tinymce/plugins/table';
import 'tinymce/plugins/image';

// Import model
import 'tinymce/models/dom';

// Import CSS skins
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.min.css';

// Config TinyMCE cho local self-hosted
export const baseTinyMCEConfig = {
  height: 300,
  menubar: false,
  plugins: [
    'lists',
    'link', 
    'code',
    'table',
    'image'
  ],
  toolbar: 'undo redo | bold italic | ' +
    'alignleft aligncenter alignright | ' +
    'bullist numlist | link table image code',
  skin: false,            // vì ta đã import CSS skin thủ công
  content_css: false,     // tương tự
  branding: false,
  promotion: false,
  statusbar: false,
  resize: false,
  // Tắt các tính năng có thể gây lỗi
  convert_urls: false,
  relative_urls: false,
  remove_script_host: false,
};

export default baseTinyMCEConfig; 
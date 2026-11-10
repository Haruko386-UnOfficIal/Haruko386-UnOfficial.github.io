window.gallerySettings = { initialIndex: 6 };

window.galleryImages = [
  {
    src: 'https://haruko386.github.io/gallery/img/img_100.jpg',
  },
  {
    src: 'https://haruko386.github.io/gallery/img/img_60.jpg',
  },
  {
    src: 'https://haruko386.github.io/gallery/img/img_108.webp',
  },
  {
    src: 'https://haruko386.github.io/gallery/img/img_33.jpg',
  },
  {
    src: 'https://haruko386.github.io/gallery/img/img_39.jpg',
  },
  {
    src: 'https://haruko386.github.io/gallery/img/img_101.jpg',
  },
  {
    src: 'https://raw.githubusercontent.com/Haruko386-UnOfficIal/ImageBed/b8612993eb3cf00337b8b3e60729b6f9e9149e91/haruko386-unoffical/collab/DSC_0216.webp',
  },
  {
    src: 'https://haruko386.github.io/gallery/img/img_27.jpg',
  },
  {
    src: 'https://haruko386.github.io/gallery/img/img_50.jpg',
  },
  {
    src: 'https://raw.githubusercontent.com/Haruko386-UnOfficIal/ImageBed/572cfd1b650f226ca0a8bf4a5505021599e7c8fb/haruko386.github.io/gallery/0bb8af8eaa4d3e4612c385ae97e8acda.jpg',
  },
  {
    src: 'https://haruko386.github.io/gallery/img/img_74.png',
  },
  {
    src: 'https://haruko386.github.io/gallery/img/img_97.png',
  },
  {
    src: 'https://haruko386.github.io/gallery/img/img_111.webp',
  },
  {
    src: 'https://haruko386.github.io/gallery/img/img_49.jpg',
  }
];

// 侧栏最下方的外部链接，显示在最后一个分类之后（留有一段间距）。
// name 是显示文字，href 是外部地址；留空数组则不显示任何外部链接。
window.galleryLinks = [
  { name: 'Gallery', href: 'https://haruko386.github.io/gallery/' },
];

// 每个对象是一个独立作品集；侧栏根据这里自动生成。
// id 必须唯一，使用英文字母、数字、短横线；name 是导航名称。
// view: 'photo' 首屏为单张照片，'archive' 首屏为缩略图目录。
// 这两个现有入口暂时共享照片。要分类展示，把 images 换成各自的数组。
window.galleryCollections = [
  // {
  //   id: 'photographs',
  //   name: 'Photographs',
  //   view: 'photo',
  //   initialIndex: window.gallerySettings.initialIndex,
  //   images: window.galleryImages,
  // },
  {
    id: 'waiting',
    name: "Collab",
    view: 'archive',
    images: window.galleryImages,
  },
  {
    id: 'portraiture',
    name: 'Portraiture',
    view: 'archive',
    images: [
      {
        src: 'https://raw.githubusercontent.com/Haruko386-UnOfficIal/ImageBed/030cf8d624c54f2c67712506aa690b53aba9ec68/haruko386.github.io/gallery/e8140bb61f4421c13199da0d0ec0ba76.jpg',
      },
      {
        src: 'https://haruko386.github.io/gallery/img/img_15.jpg',
      }
    ] 
  },
   {
    id: 'TBD',
    name: 'TBD',
    view: 'archive',
    images: [
    ]
  },
  {
    "id": "equipment",
    "name": "Equipment",
    "view": "archive",
    "images": [
      {
        src: "https://raw.githubusercontent.com/Haruko386-UnOfficIal/ImageBed/5e57c7eb53f48d86338107f016c72bb70d787379/haruko386-unoffical/collab/01.jpg",
        title: "ROG Azoth X",
      },
      {
        src: "https://raw.githubusercontent.com/Haruko386-UnOfficIal/ImageBed/5e57c7eb53f48d86338107f016c72bb70d787379/haruko386-unoffical/collab/02.jpg",
        title: "ROG Falchion Ace HFX",
      },
      {
        src: "https://raw.githubusercontent.com/Haruko386-UnOfficIal/ImageBed/5e57c7eb53f48d86338107f016c72bb70d787379/haruko386-unoffical/collab/03.jpg",
        title: "ROG Keris II Origin & ROG Cetra True Wireless SpeedNova",
      },
      {
        src: "https://raw.githubusercontent.com/Haruko386-UnOfficIal/ImageBed/5e57c7eb53f48d86338107f016c72bb70d787379/haruko386-unoffical/collab/04.jpg",
        title: "Beitong Asura 2Pro+ & ROG Hone Ace Aim Lab Edition",
      }
    ],
  },
  // 添加页面示例（取消注释，并换成自己的图片链接）：
  // {
  //   id: 'portraits',
  //   name: 'Portraits',
  //   view: 'archive', // photo / archive
  //   images: [
  //     { src: 'https://img.example.com/portrait.jpg', title: '肖像' },
  //   ],
  // },
];

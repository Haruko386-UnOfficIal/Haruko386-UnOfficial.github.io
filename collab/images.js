window.gallerySettings = { initialIndex: 6 };

window.galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    title: 'Above the silence',
    alt: '云层间耸立的山峰',
    source: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
  },
  {
    src: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
    title: 'Wild, and still',
    alt: '林地间的野生鹿与自然风景',
    source: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    title: 'Where light wanders',
    alt: '阳光穿过茂密的绿色森林',
    source: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
  },
  {
    src: 'https://images.unsplash.com/photo-1500534623283-312aade485b7',
    title: 'The open country',
    alt: '柔和光线下的旷野与远山',
    source: 'https://images.unsplash.com/photo-1500534623283-312aade485b7',
  },
  {
    src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    title: 'Under a million stars',
    alt: '星空下的雪山',
    source: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
  },
  {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    title: 'A little further',
    alt: '层层延伸的山谷与群山',
    source: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
  },
  {
    src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
    title: 'Still waters',
    alt: '湖面映照着山川与天空',
    source: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
  },
  {
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    title: 'Between earth & sky',
    alt: '山间湖泊与遥远的山脊',
    source: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
  },
  {
    src: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8',
    title: 'The first light',
    alt: '晨雾笼罩的田野和丘陵',
    source: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8',
  },
  {
    src: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732',
    title: 'Into the distance',
    alt: '平静的蓝色海面与朦胧的地平线',
    source: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732',
  },
  {
    src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716',
    title: 'Water, falling',
    alt: '绿意环绕的瀑布与溪流',
    source: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716',
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    title: 'An endless shore',
    alt: '海浪轻拂白色沙滩',
    source: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
  },
];

// 每个对象是一个独立作品集；侧栏根据这里自动生成。
// id 必须唯一，使用英文字母、数字、短横线；name 是导航名称。
// view: 'photo' 首屏为单张照片，'archive' 首屏为缩略图目录。
// 这两个现有入口暂时共享照片。要分类展示，把 images 换成各自的数组。
window.galleryCollections = [
  {
    id: 'photographs',
    name: 'Photographs',
    view: 'photo',
    initialIndex: window.gallerySettings.initialIndex,
    images: window.galleryImages,
  },
  {
    id: 'waiting',
    name: "I'm waiting……",
    view: 'archive',
    images: window.galleryImages,
  },
  {
    "id": "peripherals",
    "name": "Peripherals",
    "view": "archive",
    "images": [
      {
        src: "https://github.com/Haruko386-UnOfficIal/ImageBed/blob/5e57c7eb53f48d86338107f016c72bb70d787379/haruko386-unoffical/collab/01.jpg",
        title: "ROG Azoth X",
      },
      {
        src: "https://github.com/Haruko386-UnOfficIal/ImageBed/blob/5e57c7eb53f48d86338107f016c72bb70d787379/haruko386-unoffical/collab/02.jpg",
        title: "ROG Falchion Ace HFX",
      },
      {
        src: "https://github.com/Haruko386-UnOfficIal/ImageBed/blob/5e57c7eb53f48d86338107f016c72bb70d787379/haruko386-unoffical/collab/03.jpg",
        title: "ROG Keris II Origin & ROG Cetra True Wireless SpeedNova",
      },
      {
        src: "https://github.com/Haruko386-UnOfficIal/ImageBed/blob/5e57c7eb53f48d86338107f016c72bb70d787379/haruko386-unoffical/collab/04.jpg",
        title: "Beitong Asura 2Pro+ & ROG Hone Ace Aim Lab Edition",
      }
    ],
  }
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

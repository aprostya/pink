module.exports = function(grunt) {

  // подключаем плагин load-grunt-tasks, чтобы не перечислять все прочие плагины
  require('load-grunt-tasks')(grunt);

  // описываем задачи, которые планируем использовать (их запуск - см. низ этого файла)
  grunt.initConfig({

    uglify: {
      start: {
        files: {
          'js/script.min.js': ['js/script.js']
        }
      }
    },

    imagemin: {
      build: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          src: ['img/sprite_svg/*.svg']
        }]
      }
    },

    // компилируем препроцессор
    less: {
      style: {
        options: {
          compress: false,
          yuicompress: false,
          optimization: 2,
        },
        files: {
          // в какой файл, из какого файла
          // 'build/css/style.css': ['src/less/style.less']
          './css/style.css': ['./less/style.less']
        },
      }
    },
    
    svgstore: {
      options: {
        includeTitleElement: false,
        svg: {
          style: 'display:none',
        },
        cleanup: [
          'fill',
        ],
      },
      default : {
        files: {
          'img/sprite.svg': ['img/sprite_svg/*.svg'],
        },
      },
    },

    // обрабатываем postcss-ом (там только autoprefixer, на самом деле)
    postcss: {
      options: {
        processors: [
          // автопрефиксер и его настройки
          require("autoprefixer")({browsers: "last 2 versions"})
        ]
      },
      style: {
        // какие файлы обрабатывать (все .css в указанной папке)
        src: "build/css/*.css"
      }
    },

    // объединяем медиавыражения
    cmq: {
      style: {
        files: {
          // в какой файл, из какого файла (тут это один и тот же файл)
          'build/css/style.css': ['build/css/style.css']
        }
      }
    },

    // минимизируем стилевые файлы
    cssmin: {
      style: {
        options: {
          keepSpecialComments: 0
        },
        files: [{
          expand: true,
          // в какой папке брать исходники
          cwd: 'build/css',
          // какие файлы (ЛЮБОЕ_ИМЯ.css, но не ЛЮБОЕ_ИМЯ.min.css)
          src: ['*.css', '!*.min.css'],
          // в какую папку писать результат
          dest: 'build/css',
          // какое расширение дать результатам обработки
          ext: '.min.css'
        }]
      }
    },

    // процесс копирования
    copy: {
      // копируем картинки
      img: {
        expand: true,
        // откуда
         cwd: './img/',
        // cwd: 'src/img/',
        // какие файлы (все картинки (см. расширения) из корня указанной папки и всех подпапок)
        src: ['**/*.{png,jpg,gif,svg}'],
        // куда
        dest: 'build/img/',
      },

      js: {
        expand: true,
        // откуда
        cwd: './js/',

        // cwd: 'src/js/',
        // какие файлы
        src: ['*.js'],
        // куда
        dest: 'build/js/',
      },
    },

    // обрабатываем разметку (инклуды, простейший шаблонизатор)
    includereplace: {
      html: {
        expand: true,
        // откуда брать исходные файлы
        cwd: './',
        // cwd: 'src/',
        // какие файлы обрабатывать
        src: '*.html',
        // куда писать результат обработки
        dest: 'build/',
      }
    },

    // публикация на GitHub Pages (будет доступен в сети по адресу http://ВАШ-НИКНЕЙМ.github.io/ВАШ-РЕПОЗИТОРИЙ/)
    'gh-pages': {
      options: {
        // какую папку считать результатом работы
        base: 'build'
      },
      src: '**/*'
    },

    // слежение за файлами
    watch: {
      // перезагрузка? да, детка!
      livereload: {
        options: { livereload: true },
        files: ['build/**/*'],
      },
      // следить за стилями
      style: {
        // за фактом с сохранения каких файлов следить
        files: ['./less/**/*.less'],
        // files: ['src/less/**/*.less'],
        // какую задачу при этом запускать (сами задачи — см. ниже)
        tasks: ['style'],
        options: {
          spawn: false,
        },
      },
      // следить за картинками
      images: {
        // за фактом с сохранения каких файлов следить
        files: [
          'img/sprite_svg/*.svg'
        ],
        // files: ['src/img/**/*.{png,jpg,gif,svg}'],
        // какую задачу при этом запускать (сами задачи — см. ниже)
        tasks: ['img'],
        options: {
          spawn: false
        },
      },
      // следить за файлами разметки
      html: {
        // за фактом с сохранения каких файлов следить
        // files: ['src/*.html', 'src/_html_inc/*.html'],
         files: ['./*.html', 'src/_html_inc/*.html'],
        // какую задачу при этом запускать (указан сам процесс)
        tasks: ['includereplace:html'],
        options: {
          spawn: false
        },
      },
    },

    // локальный сервер, автообновление
    browserSync: {
      dev: {
        bsFiles: {
          // за изменением каких файлов следить для автообновления открытой в браузере страницы с локального сервера
          src : [
            'build/css/*.css',
            'build/js/*.js',
            'build/img/*.{png,jpg,gif,svg}',
            'build/*.html',
             'img/sprite.svg',
            './index.html',
          ]
        },
        options: {
          watchTask: true,
          server: {
            // корень сервера
            baseDir: "build/",
          },
          // синхронизация между браузерами и устройствами (если одна и та же страница открыта в нескольких браузерах)
          ghostMode: {
            clicks: true,
            forms: true,
            scroll: false
          }
        }
      }
    }

  });
  // задача по умолчанию
  grunt.registerTask('default', [
    'style',
    'img',
    'includereplace:html',
    'copy:js',
    'browserSync',
    'watch'
  ]);

  // только компиляция стилей
  grunt.registerTask('style', [
    'less',
    'postcss',
    'cmq',
    'cssmin'
  ]);

  // только обработка картинок
  grunt.registerTask('img', [
    'copy:img',
    'imagemin',
    'svgstore'
  ]);

  // сборка
  grunt.registerTask('build', [
    'style',
    'img',
    'includereplace:html',
    'gh-pages'
  ]);
};






// module.exports = function(grunt) {

//   require('load-grunt-tasks')(grunt);

//   grunt.initConfig({

//     uglify: {
//       start: {
//         files: {
//           'js/script.min.js': ['js/script.js']
//         }
//       }
//     },
//     imagemin: {
//       build: {
//         options: {
//           optimizationLevel: 3
//         },
//         files: [{
//           expand: true,
//           src: ['img/sprite_svg/*.svg']
//         }]
//       }
//     },
//     svgstore: {
//       options: {
//         includeTitleElement: false,
//         svg: {
//           style: 'display:none',
//         },
//         cleanup: [
//           'fill',
//         ],
//       },
//       default : {
//         files: {
//           'img/sprite.svg': ['img/sprite_svg/*.svg'],
//         },
//       },
//     },

//     watch: {
//       livereload: {
//         options: { livereload: true },
//         files: ['build/**/*'],
//       },
//       scripts: {
//         files: ['js/script.js'],
//         tasks: ['js'],
//         options: {
//           spawn: false
//         },
//       },
//       images: {
//         files: [
//           'img/sprite_svg/*.svg'
//         ],
//         tasks: ['img'],
//         options: {
//           spawn: false
//         },
//       },
//       html: {
//         files: ['./index.html'],
//         tasks: ['html'],
//         options: {
//           spawn: false
//         },
//       },
//     },

//     browserSync: {
//       dev: {
//         bsFiles: {
//           src : [
//             'img/sprite.svg',
//             './index.html',
//           ]
//         },
//         options: {
//           watchTask: true,
//           server: {
//             baseDir: "./",
//           },
//           startPath: "index.html",
//           ghostMode: {
//             clicks: true,
//             forms: true,
//             scroll: false
//           }
//         }
//       }
//     }

//   });
// grunt.loadNpmTasks('grunt-contrib-uglify'); 
//   grunt.registerTask('default', [
//     'js',
//     'img',
//     'browserSync',
//     'watch'
//   ]);

//   grunt.registerTask('js', [
//     'uglify'
//   ]);

//   grunt.registerTask('img', [
//     'imagemin',
//     'svgstore'
//   ]);

// };
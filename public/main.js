/**
 * Copyright Elastic Path Software 2013.
 *
 * User: sbrookes
 * Date: 18/03/13
 * Time: 1:26 PM
 *
 */

require.config({
  paths: {
    'jquery'          : 'scripts/lib/jquery-1.8.3',
    'underscore'      : 'scripts/lib/underscore',
    'backbone'        : 'scripts/lib/backbone',
    'marionette'      : 'scripts/lib/backbone.marionette',
    'modernizr'       : 'scripts/lib/modernizr-latest',
    'pace'            : 'scripts/lib/pace.min',
    'bootstrap'       : 'scripts/lib/bootstrap.min',
    'URI'             : 'scripts/lib/URI',
    'equalize'        : 'scripts/lib/plugins/jquery-equalheights',
    'tabs'            : 'scripts/lib/plugins/kube.tabs',
    'contextmenu'     : 'scripts/lib/plugins/jquery.contextmenu',
    'router'          : 'router',
    'ep'              : 'ep.client',
    'mediator'        : 'ep.mediator',
    'jsonpath'        : 'scripts/lib/jsonpath-0.8.0',
    'i18n'            : 'scripts/lib/i18next.amd-1.6.0',
    'eventbus'        : 'eventbus',
    'toast'           : 'scripts/lib/plugins/jquery.toastmessage',
    'colorpicker'     : 'scripts/lib/plugins/colorpicker',
    'modalwin'        : 'scripts/lib/plugins/jquery.simplemodal-1.4.4',
    'app'             : 'modules/base/app/app.controller',
    'app.models'      : 'modules/base/app/app.models',
    'app.views'       : 'modules/base/app/app.views',
    'ia'              : 'modules/base/ia/ia.controller',
    'ia.models'       : 'modules/base/ia/ia.models',
    'ia.views'        : 'modules/base/ia/ia.views',
    'cortex'          : 'modules/base/cortex/cortex.controller',
    'home'            : 'modules/base/home/home.controller',
    'home.models'     : 'modules/base/home/home.models',
    'home.views'      : 'modules/base/home/home.views',
    'item'            : 'modules/base/item/item.controller',
    'item.models'     : 'modules/base/item/item.models',
    'item.views'      : 'modules/base/item/item.views',
    'category'        : 'modules/base/category/category.controller',
    'category.models' : 'modules/base/category/category.models',
    'category.views'  : 'modules/base/category/category.views',
    'appheader'       : 'modules/base/appheader/appheader.controller',
    'appheader.models': 'modules/base/appheader/appheader.models',
    'appheader.views' : 'modules/base/appheader/appheader.views',
    'uiform'          : 'modules/base/ui/ui.form.controller',
    'uiform.models'   : 'modules/base/ui/ui.form.models',
    'uiform.views'    : 'modules/base/ui/ui.form.views',
    'uieditor'        : 'modules/base/ui/ui.codeeditor.controller',
    'uieditor.models' : 'modules/base/ui/ui.codeeditor.models',
    'uieditor.views'  : 'modules/base/ui/ui.codeeditor.views',
    'uimodal'         : 'modules/base/ui/ui.modal.controller',
    'uimodal.models'  : 'modules/base/ui/ui.modal.models',
    'uimodal.views'   : 'modules/base/ui/ui.modal.views',
    'uiaccordion'     : 'modules/base/ui/ui.accordion.controller',
    'uiaccordion.models': 'modules/base/ui/ui.accordion.models',
    'uiaccordion.views': 'modules/base/ui/ui.accordion.views',
    'settings'        : 'modules/base/settings/settings.controller',
    'settings.models' : 'modules/base/settings/settings.models',
    'settings.views'  : 'modules/base/settings/settings.views',
    'search'          : 'modules/base/search/search.controller',
    'search.models'   : 'modules/base/search/search.models',
    'search.views'    : 'modules/base/search/search.views',
    'profile'         : 'modules/base/profile/profile.controller',
    'profile.models'  : 'modules/base/profile/profile.models',
    'profile.views'   : 'modules/base/profile/profile.views',
    'cart'            : 'modules/base/cart/cart.controller',
    'cart.models'     : 'modules/base/cart/cart.models',
    'cart.views'      : 'modules/base/cart/cart.views',
    'user'            : 'modules/base/user/user.controller',
    'user.models'     : 'modules/base/user/user.models',
    'user.views'      : 'modules/base/user/user.views',
    'receipt'         : 'modules/base/receipt/receipt.controller',
    'debug'           : 'modules/base/debug/debug.controller',
    'auth'            : 'modules/base/auth/auth.controller',
    'auth.models'     : 'modules/base/auth/auth.models',
    'auth.views'      : 'modules/base/auth/auth.views'
  },
  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    marionette : {
      deps : ['backbone','underscore','jquery'],
      exports : 'Marionette'
    },
    ep : {
      deps: ['jquery','marionette'],
      exports: 'ep'
    },
    i18n: {
      deps: ['jquery'],
      exports: 'i18n'
    },
    bootstrap: {
      deps: ['jquery'],
      exports: 'bootstrap'
    },
    'underscore': {
      'exports': '_'
    }
  }
});

//require(['app','eventbus','i18n'],
require(['app','eventbus','i18n','bootstrap'],
  function (App,EventBus,i18n){

    // Application DOM container is ready (viewport)
    $(document).ready(function(){

      // initialize the localization engine
      i18n.init({
          lng: 'en' // default to english
        },
        function(){

          // trigger event to let the application know it is safe to kick off
          EventBus.trigger('app.bootstrapInitSuccess');

        }
      );
    }
  );
});

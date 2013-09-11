/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 05/04/13
 * Time: 1:31 PM
 *
 */
define(['app', 'ep', 'eventbus', 'modules/category/category.models', 'modules/category/category.views', 'text!modules/category/category.templates.html'],
  function (App, ep, EventBus, Model, View, template) {

    $('#TemplateContainer').append(template);
    _.templateSettings.variable = 'E';

    /*
     *
     * DEFAULT VIEW
     *
     *
     */
    var defaultView = function (uri) {
      var categoryLayout = new View.DefaultView();
      var categoryModel = new Model.CategoryModel('zoom');

      categoryModel.fetch({
        url: ep.ui.decodeUri(uri) + categoryModel.zoom,
        success: function (response) {

          categoryLayout.categoryTitleRegion.show(
            new View.CategoryTitleView({
              model: categoryModel
            }));
          categoryLayout.categoryPaginationTopRegion.show( getCategoryPaginationView(response) );
          categoryLayout.categoryBrowseRegion.show( getCategoryBrowseView(response) );
          categoryLayout.categoryPaginationBottomRegion.show( getCategoryPaginationView(response) );
        },
        error: function (response) {
          ep.logger.error('error fetch category model ' + response);
        }
      });

      return categoryLayout;
    };




    /*
     *
     *
     * EVENT LISTENERS
     *
     *
     */
    EventBus.on('category.paginationBtnClicked', function (direction, uri) {
      ep.logger.info(direction + ' btn clicked.');

      EventBus.trigger('category.reloadCategoryViewsRequest', uri);

    });
    EventBus.on('category.reloadCategoryViewsRequest', function (uri) {
      ep.logger.info('navigation to a different page');

      // declare regions
      var browseRegion = new Backbone.Marionette.Region({
        el: '[data-region="categoryBrowseRegion"]'
      });
      var paginationTopRegion = new Backbone.Marionette.Region({
        el: '[data-region="categoryPaginationTopRegion"]'
      });
      var paginationBottomRegion = new Backbone.Marionette.Region({
        el: '[data-region="categoryPaginationBottomRegion"]'
      });

      // reload views
      var categoryModel = new Model.CategoryReloadModel('zoom');
      categoryModel.fetch({
        url: ep.app.config.cortexApi.path + uri + categoryModel.zoom,
        success: function (response) {
          browseRegion.show( getCategoryBrowseView(response) );
          paginationTopRegion.show( getCategoryPaginationView(response) );
          paginationBottomRegion.show( getCategoryPaginationView(response) );
        }
      });

      ep.logger.info('category browse refreshed.');
    });





    /*
     *
     *
     * FUNCTIONS
     *
     */
    var getCategoryBrowseView = function(model) {
      var tempModelObj = new Model.CategoryItemCollectionModel();
      var itemCollectionModel = new Model.CategoryItemCollectionModel(tempModelObj.parse(model.attributes.itemCollection));
      var browseView = new View.CategoryItemCollectionView({
        collection: itemCollectionModel
      });

      return browseView;
    };

    var getCategoryPaginationView = function(model) {
      var tempModelObj = new Model.CategoryPaginationModel();
      var paginationModel = new Model.CategoryPaginationModel(tempModelObj.parse(model.attributes.pagination));
      var paginationView = new View.CategoryPaginationView({
        model: paginationModel
      });

      return paginationView;
    };

    return {
      DefaultView: defaultView
    };
  }
);

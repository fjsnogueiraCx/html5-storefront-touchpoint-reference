/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 * 
 */
define(['jquery','ep','app', 'eventbus', 'cortex', 'modules/item/item.models', 'modules/item/item.views', 'text!modules/item/item.templates.html','i18n'],
  function($, ep, App, EventBus, Cortex, Model, View, template,i18n){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';



    var defaultItemDetailView = function(id){

      var defaultItemViewLayout = new View.DefaultLayout({
        className:''
      });

      var itemModel = new Model.ItemModel();

      var itemUrl = ep.app.config.cortexApi.path + '/items/' + ep.app.config.cortexApi.store + '/' + id  + '?zoom=availability,addtocartform,price,definition,definition:assets:element';

      itemModel.fetch({
        url: itemUrl,
        success:function(response){

          // Attribute List Collection
          var attribsList = new Model.ItemAttributeCollection(response.attributes.details);

          // Title View
          var titleView = new View.DefaultItemTitleView({
            model:itemModel
          });

          // Asset Imge Url Processing
          var urlVal = itemModel.attributes.asset.url;
          var modelObject = {src:urlVal};
          var assetView = new View.DefaultItemAssetView({
            model:new Backbone.Model(itemModel)
          });
          // Attribute View
          var attributeView = new View.DefaultItemAttributeView({
            collection:attribsList
          });
          // Availability View
          var availabilityView = new View.DefaultItemAvailabilityView({
            model:itemModel
          });
          // Price View
          var priceView = new View.DefaultItemPriceView({
            model:itemModel
          });
          // Add To Cart View
          var addToCartView = new View.DefaultItemAddToCartView({
            model:itemModel
          });

          defaultItemViewLayout.itemDetailTitleRegion.show(titleView);
          defaultItemViewLayout.itemDetailAssetRegion.show(assetView);
          defaultItemViewLayout.itemDetailAttributeRegion.show(attributeView);
          defaultItemViewLayout.itemDetailAvailabilityRegion.show(availabilityView);
          defaultItemViewLayout.itemDetailPriceRegion.show(priceView);
          defaultItemViewLayout.itemDetailAddToCartRegion.show(addToCartView);


        },
        error:function(response){
          ep.logger.info('ERROR GETTING THE ITEM: ' + response);
        }
      });


      return defaultItemViewLayout;
    };

    /*
    *
    *
    *   EVENT LISTENERS
    *
    * */

    EventBus.on('item.loadDefaultCartRequest',function(){
      var test = 'test';
      // request cart data from Coretext
      document.location.href = '/#mycart';
      // render cart view in main nav
    });
    EventBus.on('item.addToCartBtnClicked',function(event){
      var formActionLink = $(event.target).data('actionlink');

      if (formActionLink){

        var qty = View.getAddToCartQuantity();

        if (qty > 0){

          var obj = '{quantity:' + qty +'}';
          // TODO improve robustness of oauth token when we work on that story
          var oAuthToken = window.localStorage.getItem('oAuthToken');
          if(oAuthToken){
            ep.io.ajax({
              type:'POST',
              beforeSend: function (request)
              {
                request.setRequestHeader("Authorization", oAuthToken);
              },
              contentType:'application/json',
              url:formActionLink,
              data:obj,
              success:function(response,x, y){
                // follow link response
                ep.logger.info('Success posting to cart - go to cart view');

                // get the location header
                ep.logger.info(response);
                // ep.logger.info(request);
                ep.logger.info(JSON.stringify(y));
                var lineItemUrl = y.getResponseHeader('Location');
                ep.logger.info(lineItemUrl);
                if (lineItemUrl){
                  EventBus.trigger('item.loadDefaultCartRequest');
                }
                else{
                  ep.logger.warn('add to cart success but no cart url returned');
                }


                ep.logger.info('we are done load the cart view');



              },
              error:function(response){
                ep.logger.error('error posting item to cart: ' + response);
              }
            });
          }
          else{
            ep.logger.warn('add to cart called with no auth token');
          }

        }
        else{
          ep.logger.warn('add to cart called with no quantity');
        }

      }
    });


    return {
      DefaultLayout:View.DefaultLayout,
      DefaultItemDetailView:defaultItemDetailView,
      ItemModel:Model.ItemModel
    };
  }
);

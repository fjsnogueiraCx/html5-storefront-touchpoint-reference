/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 * Default Profile Controller
 * The HTML5 Reference Storefront's MVC controller instantiates the profile model and views,
 * renders profile views in designated regions. It also manages events and functions to add a new address.
 */
define(function (require) {
  var ep = require('ep');
  var EventBus = require('eventbus');
  var Mediator = require('mediator');
  var Backbone = require('backbone');
  var i18n = require('i18n');

  var Model = require('profile.models');
  var View = require('profile.views');
  var template = require('text!modules/base/profile/base.profile.templates.html');

  $('#TemplateContainer').append(template);

  _.templateSettings.variable = 'E';

  var profileModel = new Model.ProfileModel();
  var summaryModel = new Backbone.Model();
  var subscriptionCollection = new Backbone.Collection();
  var purchaseHistoryCollection = new Model.ProfilePurchaseCollection();
  var addressesCollection = new Backbone.Collection();
  var formErrorsCollection = new Backbone.Collection({}, {comparator: "error"});

  var defaultLayout = new View.DefaultLayout();

  var profileSummaryViewController = function (region) {
    var summaryView = new View.ProfileSummaryView({
      model: summaryModel
    });
    region.show(summaryView);
  };

  var profileSubscriptionViewController = function (region) {
    var profileSubscriptionView = new View.ProfileSubscriptionSummaryView({
      collection: subscriptionCollection
    });
    region.show(profileSubscriptionView);
  };

  var profilePurchaseViewController = function (region) {
    var profilePurchaseView = new View.ProfilePurchasesHistoryView({
      collection: purchaseHistoryCollection
    });
    region.show(profilePurchaseView);
  };

  /**
   * If user is logged in renders the DefaultLayout of profile module, and fetch model from backend;
   * upon model fetch success, renders profile views in designated regions.
   * If user isn't logged in, trigger request to prompt user login.
   * @returns {View.DefaultLayout}  with populated data and child views ready to render.
   */
  var defaultController = function () {

    // ensure the user is authenticated before continuing to process the request
    if (ep.app.isUserLoggedIn()) {
      profileModel.fetch({
        success: function (response) {
          // Profile Title
          var profileTitleView = new View.ProfileTitleView();
          defaultLayout.profileTitleRegion.show(profileTitleView);

          // Profile Summary
          summaryModel.set(response.get('summary'));
          profileSummaryViewController(defaultLayout.profileSummaryRegion);

          // Subscriptions
          subscriptionCollection.update(response.get('subscriptions'));
          profileSubscriptionViewController(defaultLayout.profileSubscriptionSummaryRegion);

          // Purchase History
          purchaseHistoryCollection.update(response.get('purchaseHistories'));
          profilePurchaseViewController(defaultLayout.profilePurchaseHistoryRegion);

          // Profile Addresses
          addressesCollection.update(response.get('addresses'));
          var profileAddressesView = new View.ProfileAddressesView({
            collection: addressesCollection
          });
          defaultLayout.profileAddressesRegion.show(profileAddressesView);

          // Profile Payment Methods
          var profilePaymentMethodsView = new View.ProfilePaymentMethodsView({
            collection: new Backbone.Collection(response.get('paymentMethods'))
          });
          defaultLayout.profilePaymentMethodsRegion.show(profilePaymentMethodsView);
        },
        error: function (response) {
          ep.logger.error('Error getting profile model: ' + JSON.stringify(response));
        }
      });
      return defaultLayout;
    }
    else {
      Mediator.fire('mediator.loadRegionContent', 'loginModal');
    }

  };

  /* ********* Address EVENT LISTENERS ************ */
  /**
   * Listen to add new address button clicked signal
   * will load address form
   */
  EventBus.on('profile.addNewAddressBtnClicked', function () {
    Mediator.fire('mediator.addNewAddressRequest', 'profile');
  });

  /**
   * Handler for the edit address button clicked signal, which triggers an edit address request.
   */
  EventBus.on('profile.editAddressBtnClicked', function (href) {
    Mediator.fire('mediator.editAddressRequest', {
      returnModule: 'profile',
      href: href
    });
  });


  /**
   * Handler for the delete address button clicked signal, which triggers a mediator strategy
   * to communicate the request to the address module.
   */
  EventBus.on('profile.deleteAddressBtnClicked', function (href) {
    Mediator.fire('mediator.deleteAddressRequest', {
      href: href,
      indicatorView: defaultLayout.profileAddressesRegion.currentView,
      returnModule: 'profile'
    });
  });

  /**
   * Called when an address has been successfully deleted from Cortex. Performs a fetch of the profile
   * model and updates the collection of addresses with the updated array from Cortex.
   */
  EventBus.on('profile.updateAddresses', function (indicatorView) {
    profileModel.fetch({
      success: function (response) {
        // Update the collection of addresses with the new array of addresses from Cortex
        var newAddresses = response.get('addresses');

        if (indicatorView) {
          // Stop the activity indicators on the cart regions that are being updated
          ep.ui.stopActivityIndicator(indicatorView);
        }

        addressesCollection.update(newAddresses);
      }
    });
  });

  /* ********* Address EVENT LISTENERS ************ */
  EventBus.on('profile.editSummaryBtnClicked', function (model) {
    EventBus.trigger('profile.loadSummaryFormViewRequest', model);
  });

  EventBus.on('profile.loadSummaryFormViewRequest', function (model) {
    var summaryFormView = new View.ProfileSummaryFormView({
      model: model
    });

    defaultLayout.profileSummaryRegion.show(summaryFormView);
  });

  EventBus.on('profile.summarySaveBtnClicked', function (actionLink) {
    ep.ui.disableButton(defaultLayout.profileSummaryRegion.currentView, 'saveBtn');
    EventBus.trigger('profile.submitProfileSummaryFormRequest', actionLink);
  });

  EventBus.on('profile.summaryCancelBtnClicked', function () {
    EventBus.trigger('profile.loadSummaryViewRequest');
  });

  EventBus.on('profile.loadSummaryViewRequest', function () {
    profileModel.fetch({
      success: function (response) {
        summaryModel.set(response.get('summary'));
      }
    });
    profileSummaryViewController(defaultLayout.profileSummaryRegion);
  });

  EventBus.on('profile.submitProfileSummaryFormRequest', function (actionLink) {
    var formValue = View.getSummaryFormValue();

    // Remove any form errors that were previously generated before we make the AJAX request
    formErrorsCollection.reset();

    var ajaxModel = new ep.io.defaultAjaxModel({
      type: 'PUT',
      url: actionLink,
      data: JSON.stringify(formValue),
      success: function () {
        EventBus.trigger('profile.submitSummaryFormSuccess');
      },
      customErrorFn: function (response) {
        EventBus.trigger('profile.submitSummaryFormFailed', response);
      }
    });

    ep.io.ajax(ajaxModel.toJSON());
  });

  EventBus.on('profile.submitSummaryFormSuccess', function () {
    EventBus.trigger('profile.loadSummaryViewRequest');
  });

  EventBus.on('profile.submitSummaryFormFailed', function (response) {
    var errorMsg = i18n.t('profile.personalInfo.errorMsg.generic');
    if (response && response.status === 400) {
      errorMsg = response.responseText;
    }

    var translatedErrorsArr = View.translateSummaryFormErrorMessage(errorMsg);
    formErrorsCollection.update(translatedErrorsArr);

    var summaryFormView = defaultLayout.profileSummaryRegion.currentView;
    var feedbackRegion = new Marionette.Region({
      el: '[data-region="profileInfoFeedbackRegion"]'
    });

    ep.ui.enableButton(summaryFormView, 'saveBtn');

    feedbackRegion.show(
      new View.ProfileSummaryFormErrorCollectionView({
        collection: formErrorsCollection
      })
    );
  });

  return {
    DefaultController: defaultController
  };
});

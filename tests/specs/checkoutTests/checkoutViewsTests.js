/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Checkout Views
 */
define(function (require) {
  var Backbone = require('backbone');
  var ep = require('ep');
  var EventBus = require('eventbus');
  var Mediator = require('mediator');
  var EventTestFactory = require('EventTestFactory');
  var EventTestHelpers = require('testhelpers.event');
  var dataJSON = require('text!/tests/data/checkout.json');

  describe('Checkout Module: Views', function () {
    var views = require('checkout.views');
    var template = require('text!modules/base/checkout/base.checkout.templates.html');
    var data = JSON.parse(dataJSON).response;

    before(function () {
      $("#Fixtures").append(template);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('DefaultLayout', function () {
      before(function () {
        this.view = new views.DefaultLayout();
        this.view.render();
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('view contents are rendered', function () {
        expect(this.view.el.childElementCount).to.be.equal(1);
      });

      describe('regions', function () {
        it('should have a checkoutTitleRegion region', function () {
          expect(this.view.checkoutTitleRegion).to.exist;
          expect(this.view.$el.find('[data-region="checkoutTitleRegion"]')).to.be.length(1);
        });
        it('should have a billingAddressRegion region', function () {
          expect(this.view.billingAddressesRegion).to.exist;
          expect(this.view.$el.find('[data-region="billingAddressesRegion"]')).to.be.length(1);
        });
        it('should have a cancelCheckoutActionRegion region', function () {
          expect(this.view.cancelCheckoutActionRegion).to.exist;
          expect(this.view.$el.find('[data-region="cancelCheckoutActionRegion"]')).to.be.length(1);
        });
        it('should have a checkoutOrderRegion region', function () {
          expect(this.view.checkoutOrderRegion).to.exist;
          expect(this.view.$el.find('[data-region="checkoutOrderRegion"]')).to.be.length(1);
        });
      });
    });

    describe('BillingAddressSelectorLayout', function () {
      before(function () {
        this.view = new views.BillingAddressSelectorLayout();
        this.view.render();
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('view contents are rendered', function () {
        // There should be 2 child elements (billing address radio and billing address label)
        expect(this.view.el.childElementCount).to.be.equal(2);
      });

      describe('regions', function () {
        it('should have a checkoutTitleRegion region', function () {
          expect(this.view.billingAddressRegion).to.exist;
          expect(this.view.$el.find('[data-region="billingAddressRegion"]')).to.be.length(1);
        });
      });
    });

    describe('BillingAddressesCompositeView', function () {
      before(function () {
        this.view = new views.BillingAddressesCompositeView();
        this.view.render();
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.CompositeView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('view contents are rendered', function () {
        // View should contain a heading element and a <div> region for billing addresses
        expect(this.view.el.childElementCount).to.be.equal(2);
        expect(this.view.$el.find('[data-region="billingAddressSelectorsRegion"]')).to.be.length(1);
      });
    });

    describe('CheckoutTitleView', function () {
      before(function () {
        this.view = new views.CheckoutTitleView();
        this.view.render();
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
    });

    describe('CheckoutSummaryView', function () {
      // Mock the model with just the data we need
      var rawData = {
        "totalQuantity": 1,
        "subTotal": {
          "currency": "CAD",
          "amount": 4.99,
          "display": "$4.99"
        },
        "taxTotal": {
          "currency": "CAD",
          "amount": 0.6,
          "display": "$0.60"
        },
        "taxes": [
          {
            "currency": "CAD",
            "amount": 0.35,
            "display": "$0.35",
            "title": "PST"
          },
          {
            "currency": "CAD",
            "amount": 0.25,
            "display": "$0.25",
            "title": "GST"
          }
        ],
        "total": {
          "currency": "CAD",
          "amount": 5.59,
          "display": "$5.59"
        },
        "submitOrderActionLink": "fakeSubmitLink"
      };

      before(function () {
        this.view = new views.CheckoutSummaryView({
          model: new Backbone.Model(rawData)
        });
        this.view.render();
      });

      after(function() {
        delete this.view;
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });

      describe('regions', function () {
        it('should have a checkoutTaxBreakDownRegion region', function () {
          expect(this.view.checkoutTaxBreakDownRegion).to.exist;
          expect(this.view.$el.find('[data-region="checkoutTaxBreakDownRegion"]')).to.be.length(1);
        });
      });

      describe('renders view content correctly', function() {
        it('renders the total quantity', function() {
          expect(Number($('[data-el-value="checkout.totalQuantity"]', this.view.$el).text()))
            .to.be.equal(rawData.totalQuantity);
        });
        it('renders the sub total', function() {
          expect($('[data-el-value="checkout.subTotal"]', this.view.$el).text())
            .to.be.equal(rawData.subTotal.display);
        });
        it('renders the tax total', function() {
          expect($('[data-el-value="checkout.taxTotal"]', this.view.$el).text())
            .to.be.equal(rawData.taxTotal.display);
        });
        it('renders the checkout total', function() {
          expect($('[data-el-value="checkout.total"]', this.view.$el).text())
            .to.be.equal(rawData.total.display);
        });
      });

      describe('when missing taxTotal & taxes', function() {
        before(function () {
          // Remove taxes array and taxTotal object from our raw data
          rawData.taxes = [];
          rawData.taxTotal = {};

          sinon.stub(ep.logger, 'error');

          this.view = new views.CheckoutSummaryView({
            model: new Backbone.Model(rawData)
          });
          this.view.render();
        });

        after(function () {
          ep.logger.error.restore();
        });

        it('view renders without error', function() {
          expect(ep.logger.error).to.be.not.called;
        });
      });
    });

    describe('CancelCheckoutActionView', function () {
      before(function () {
        this.view = new views.CancelCheckoutActionView();
        this.view.render();
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('renders submitOrder button', function() {
        expect(this.view.$el.find('button[data-el-label="checkout.cancelCheckout"]')).to.be.length(1);
      });

      describe('checkout cancel button clicked',
        EventTestFactory.simpleBtnClickTest('checkout.cancelOrderBtnClicked', '[data-el-label="checkout.cancelCheckout"]'));
    });

  });
});
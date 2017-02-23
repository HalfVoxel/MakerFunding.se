import React from 'react';
import { Link, withRouter } from 'react-router'

module.exports = withRouter(React.createClass({
	mixins: [Backbone.React.Component.mixin],

	getInitialState: function()
	{
		return {
			page: "form",
		};
	},

	onChange: function(event)
	{
		var s = {};
		if(event.target.type == "checkbox")
		{
			s[event.target.name] = event.target.checked;
		}
		else
		{
			s[event.target.name] = event.target.value;
		}

		this.getModel().set(s);
	},

	submit: function(event)
	{
		var _this = this;

		// Prevent the form from being submitted
		event.preventDefault();

		if(this.state.model.payment == "card")
		{
			var handler = StripeCheckout.configure({
				key: "pk_test_QJ9xGhhVpFAA8ZFI0Pf1YbS2", // TODO
				image: "https://stripe.com/img/documentation/checkout/marketplace.png", // TODO
				locale: "auto",
				token: function(token)
				{
					_this.sendDataToServer(token);
				}
			});

			// Open Checkout with further options:
			handler.open({
				name: "Crowdfunding",
				description: this.state.model.project_title,
				email: this.state.model.email,
				currency: "SEK",
				amount: 200 // TODO
			});
		}
		else
		{
			this.setState({page: "swish"});
		}
	},

	sendDataToServer: function(stripe_token)
	{
		// Save Stripe token, if any
		if(stripe_token !== undefined)
		{
			this.getModel().set({stripe_token});
		}

		// Send the data to our server
		this.getModel().save();

		// TODO: Error handling

		// Go to thank you page
		var _this = this;
		setTimeout(function() {
			_this.props.router.push("/projekt/" + _this.props.params.project_id + "/tack");
		}, 0);
	},

	confirmSwish: function()
	{
		this.sendDataToServer();
	},

	cancel: function()
	{
		this.setState({
			page: "form"
		});
	},

	render: function()
	{
		if(this.state.page == "form")
		{
			return (
				<form className="uk-form-horizontal uk-margin-top uk-margin-bottom">
					<div className="uk-margin">
						<label className="uk-form-label" htmlFor="form-stacked-text">Ditt namn:</label>
						<div className="uk-form-controls">
							<input className="uk-input" id="form-stacked-text" type="text" name="name" placeholder="Anders Andersson" onChange={this.onChange} value={this.state.model.name} />
						</div>
					</div>

					<div className="uk-margin">
						<label className="uk-form-label" htmlFor="form-stacked-text">Medlemsnummer:</label>
						<div className="uk-form-controls">
							<input className="uk-input" id="form-stacked-text" type="text" name="membernumber" placeholder="1234" onChange={this.onChange} value={this.state.model.membernumber}  />
						</div>
					</div>

					<div className="uk-margin">
						<label className="uk-form-label" htmlFor="form-stacked-text">Belopp:</label>
						<div className="uk-form-controls">
							<input className="uk-input" id="form-stacked-text" type="text" name="amount" placeholder="500" onChange={this.onChange} value={this.state.model.amount} />
						</div>
					</div>

					<div className="uk-margin">
						<label className="uk-form-label" htmlFor="form-stacked-text">E-postadress:</label>
						<div className="uk-form-controls">
							<input className="uk-input" id="form-stacked-text" type="text" name="email" placeholder="anders@example.com" onChange={this.onChange} value={this.state.model.email}  />
						</div>
					</div>

					<div className="uk-margin">
						<label className="uk-form-label" htmlFor="form-stacked-text">Meddelande:</label>
						<div className="uk-form-controls">
							<textarea className="uk-textarea" rows="5" name="message" placeholder="Meddelande" onChange={this.onChange} value={this.state.model.message}  ></textarea>
						</div>
					</div>

					<div className="uk-margin">
						<div className="uk-form-label">Betalningssätt</div>
						<div className="uk-form-controls">
							<label><input className="uk-radio" type="radio" name="payment" value="card"  checked={this.state.model.payment == "card"}  onChange={this.onChange} /> Kortbetalning</label><br />
							<label><input className="uk-radio" type="radio" name="payment" value="swish" checked={this.state.model.payment == "swish"} onChange={this.onChange} /> Swish</label>
						</div>
					</div>

					<div className="uk-margin">
						<div className="uk-form-label">Sekretess</div>
						<div className="uk-form-controls">
							<label><input className="uk-radio" type="radio" name="privacy" value="anon"   checked={this.state.model.privacy == "anon"}   onChange={this.onChange} /> Jag vill vara anonym</label><br />
							<label><input className="uk-radio" type="radio" name="privacy" value="public" checked={this.state.model.privacy == "public"} onChange={this.onChange} /> Jag godkänner att mitt namn publiceras</label>
						</div>
					</div>

					<div className="uk-margin">
						<div className="uk-form-label">Nyhetsbrev</div>
						<div className="uk-form-controls">
							<label><input className="uk-checkbox" type="checkbox" name="newsletter" checked={this.state.model.newsletter} onChange={this.onChange} /> Jag vill ha nyhetsbrev från Stockholm Makerspace</label><br />
						</div>
					</div>

					<div className="uk-margin">
						<div className="uk-form-label">Användarvillkor</div>
						<div className="uk-form-controls">
							<label><input className="uk-checkbox" type="checkbox" name="accepted" checked={this.state.model.accepted} onChange={this.onChange} /> Jag godkänner <Link to="/villkor" target="_blank">användarvillkoren</Link> för MakerFunding.se</label><br />
						</div>
					</div>

					<div className="uk-clearfix">
						<div className="uk-float-left">
							<Link to={"/projekt/" + this.props.params.project_id} className="uk-button uk-button-danger" disabled={!this.state.model.accepted}><span data-uk-icon="icon: arrow-left" /> Avbryt</Link>
						</div>

						<div className="uk-float-right">
							<button className="uk-button  uk-button-primary" disabled={!this.state.model.accepted} onClick={this.submit}>Gå vidare till betalning <span data-uk-icon="icon: arrow-right" /></button>
						</div>
					</div>

				</form>
			);
		}
		else if(this.state.page == "swish")
		{
			return (
				<div className="uk-margin-top uk-margin-bottom">
					<h2>Betala med Swish</h2>
					<p>Ta fram din Swish-apparat och släng äver en röding till Theeo!</p>

					<div>
						<div className="uk-float-left">
							<button onClick={this.cancel} className="uk-button uk-button-danger"><span data-uk-icon="icon: arrow-left" /> Avbryt</button>
						</div>

						<div className="uk-float-right uk-margin-bottom">
							<button onClick={this.confirmSwish} className="uk-button uk-button-primary">Bekräfta betalning <span data-uk-icon="icon: arrow-right" /></button>
						</div>
					</div>
				</div>
			);
		}
	}
}));
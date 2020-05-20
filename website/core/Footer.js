"use strict";

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + 'docs/' + doc;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? language + '/' : '') + doc;
  }

  render() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Guides</h5>
            <a href={this.docUrl('getting-started', this.props.language)}>Getting Started</a>
            <a href={this.docUrl('handlers', this.props.language)}>Handlers</a>
            <a href={this.docUrl('plugins', this.props.language)}>Plugins</a>
            <a href={this.docUrl('serializers-and-deserializers', this.props.language)}>Serializers and Deserializers</a>
            <a href={this.docUrl('service-tree', this.props.language)}>Serice Tree</a>
            <a href={this.docUrl('auto-responses', this.props.language)}>Auto Responses</a>
            <a href={this.docUrl('how-it-works', this.props.language)}>How it Works</a>
          </div>
          <div>
            <h5>API Reference</h5>
            <a href={this.docUrl('serviceberry', this.props.language)}>Serviceberry</a>
            <a href={this.docUrl('trunk', this.props.language)}>Trunk</a>
            <a href={this.docUrl('branch', this.props.language)}>Branch</a>
            <a href={this.docUrl('leaf', this.props.language)}>Leaf</a>
            <a href={this.docUrl('request', this.props.language)}>Reqeust</a>
            <a href={this.docUrl('response', this.props.language)}>Response</a>
            <a href={this.docUrl('httperror', this.props.language)}>HttpError</a>
          </div>
          <div>
            <h5>More</h5>
            <a href={this.props.config.baseUrl + 'blog'}>Blog</a>
            <a className="github-link" href={this.props.config.repoUrl}>GitHub</a>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/facebook/docusaurus/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub">
              Star
            </a>
            <a href={this.docUrl('contributing', this.props.language)}>Contributing</a>
            <a href={this.docUrl('license', this.props.language)}>License</a>
          </div>
        </section>
      </footer>
    );
  }
}

module.exports = Footer;

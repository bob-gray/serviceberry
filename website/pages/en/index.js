"use strict";

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

function imgUrl (img) {
  return siteConfig.baseUrl + 'img/' + img;
}

function docUrl (doc, language) {
  return siteConfig.baseUrl + 'docs/' + (language ? language + '/' : '') + doc;
}

function pageUrl (page, language) {
  return siteConfig.baseUrl + (language ? language + '/' : '') + page;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} />
  </div>
);

const ProjectTitle = props => (
  <h2 className="projectTitle">
    <img src={imgUrl('serviceberry.svg')} alt={siteConfig.title} />
    <small>{siteConfig.tagline}</small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    let language = this.props.language || '';
    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href={docUrl('getting-started.html', language)}>Get Started</Button>
            <Button href={siteConfig.repoUrl}>Contribute</Button>
            <Button href={siteConfig.repoUrl + "/issues"}>Issues</Button>
          </PromoSection>
          <p className="helloWorld">
            <code className="hljs css javascript">
              <span className="hljs-built_in">require</span>(<span className="hljs-string">"serviceberry"</span>).createTrunk().on(<span className="hljs-string">"*"</span>, () =&gt; <span className="hljs-string">"Hello World!"</span>);
            </code>
          </p>
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}>
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

const Features = props => (
  <Block layout="fourColumn">
    {[
      {
        image: imgUrl('hand-delivery.png'),
        imageAlign: 'top',
        title: 'Handlers',
        content: 'Serializers, deserializer, plugins and endpoints all handle requests in the same way.'
      },
      {
        image: imgUrl('plugin.png'),
        imageAlign: 'top',
        title: 'Plugins',
        content: 'Powerful plugins that are easy to use and easy to create.'
      },
      {
        image: imgUrl('tree-graph.svg'),
        imageAlign: 'top',
        title: 'Tree',
        content: 'Flexible tree structure reduces duplication by allowing plugins at any node.'
      }
    ]}
  </Block>
);

const FeatureCallout = props => (
  <div
    className="productShowcaseSection paddingBottom"
    style={{textAlign: 'center'}}>
    <h2>The Best API for Building HTTP APIs</h2>
    <MarkdownBlock>
      Serviceberry is designed to be flexible, extensible and easy to use. It doesn't mandate
      boilerplate or configuration or demand to marry your application. It helps you do HTTP well facilitating
      a thin HTTP frontend to your backend where statuses, methods and headers have meaning.
    </MarkdownBlock>
  </div>
);

class Index extends React.Component {
  render() {
    let language = this.props.language || '';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Features />
          <FeatureCallout />
        </div>
      </div>
    );
  }
}

module.exports = Index;

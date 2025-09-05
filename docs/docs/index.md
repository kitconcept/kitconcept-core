---
myst:
  html_meta:
    "description": "Core setup for kitconcept GmbH distributions built on top of Plone"
    "property=og:description": "Core setup for kitconcept GmbH distributions built on top of Plone"
    "property=og:title": "kitconcept.core"
    "keywords": "kitconcept.core, documentation, Core setup for kitconcept GmbH distributions built on top of Plone"
---

# kitconcept.core

Welcome to the documentation for kitconcept.core!

`````{grid} 1 1 2 2
:gutter: 3 3 4 5

````{grid-item-card}
:link: concepts/what-is-core
:link-type: doc
{octicon}`zap;1.5em;sd-text-info`
Get started
^^^
This part of the documentation describes what is kitconcept core and the reasoning behind.
+++
```{button-ref} concepts/what-is-core
:color: primary
:expand:
Go to Get started
```
````

````{grid-item-card}
:link: https://volto-light-theme.readthedocs.io/
:link-type: url
{octicon}`person;1.5em;sd-text-info`
Volto Light Theme
^^^
This is the documentation specific to VLT features.
+++
```{button-link} https://volto-light-theme.readthedocs.io/
:ref-type: ref
:color: primary
:expand:
Go to VLT docs
```
````

````{grid-item-card}
:link: https://kitconcept-intranet.readthedocs.io
:link-type: url
{octicon}`person-add;1.5em;sd-text-info`
Intranet distribution
^^^
This is the documentation specific to the kitconcept intranet distribution.
+++
```{button-ref} https://kitconceptintranet.readthedocs.io
:ref-type: ref
:color: primary
:expand:
Go to intranet docs
```
````

`````

Built with Markedly Structured Text ({term}`MyST`), this environment supports rich formatting, directives, and extensions tailored for technical documentation.

It's structured following the [Diátaxis](https://diataxis.fr/) documentation framework.

```{toctree}
:caption: How to guides
:maxdepth: 2
:hidden: true

how-to-guides/index
```

```{toctree}
:caption: Reference
:maxdepth: 2
:hidden: true

reference/index
```

```{toctree}
:caption: Tutorials
:maxdepth: 2
:hidden: true

tutorials/index
```

```{toctree}
:caption: Concepts
:maxdepth: 2
:hidden: true

concepts/index
```

```{toctree}
:caption: Appendices
:maxdepth: 2
:hidden: true

glossary
genindex
```

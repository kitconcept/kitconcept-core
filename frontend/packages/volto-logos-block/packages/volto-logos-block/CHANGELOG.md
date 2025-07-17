# Release Notes

<!-- You should *NOT* be adding new change log entries to this file.
     You should create a file in the news directory instead.
     For helpful instructions, please see:
     https://6.docs.plone.org/contributing/index.html?highlight=towncrier#change-log-entry
-->

<!-- towncrier release notes start -->

## 3.0.0-alpha.0 (2025-04-30)

### Breaking

- The data structure of the block now uses a simple array of objects.
  This package has a hard depenency on `@kitconcept/volto-light-theme`.
  The block matches the Logos Footer feature of `@kitconcept/volto-light-theme`. @Tishasoumya-02 @sneridagh

  Breaking:

  The data structure in versions <=2.x.x was using the usual blocks in block data structure (`blocks`/`blocks_layout`).
  The data structure in version 3.x.x is using a simpler arrayed `object_list` widget data structure. [#29](https://github.com/kitconcept/volto-logos-block/issue/29)

## 2.0.0-alpha.1 (2024-01-23)

### Bugfix

- fix broken hover borders in edit mode @jackahl [#17](https://github.com/kitconcept/volto-logos-block/pull/17)
- amend design to fit provided designs @jackahl [#20](https://github.com/kitconcept/volto-logos-block/pull/20)

## 2.0.0-alpha.0 (2024-01-22)

### Breaking

- rename "link" field to "href" to make it use the correct adapter [#14](https://github.com/kitconcept/volto-logos-block/pull/14)

### Bugfix

- remove css related to hiding the remove block button inside the grid @jackahl [#12](https://github.com/kitconcept/volto-logos-block/pull/12)
- remove borders around logos on hover @jakckahl [#17](https://github.com/kitconcept/volto-logos-block/pull/17)

### Internal

- Add LICENSE [#11](https://github.com/kitconcept/volto-logos-block/pull/11)
- Add proper description to package.json @tisto [#16](https://github.com/kitconcept/volto-logos-block/pull/16)

## 1.2.2 (2024-01-09)

### Bugfix

- vertically center logos @jackahl [#7](https://github.com/kitconcept/volto-logos-block/pull/7)
- hide external link icon on external links when used with vlt @jackahl [#8](https://github.com/kitconcept/volto-logos-block/pull/8)

## 1.2.1 (2024-01-04)

### Feature

- Compatiblity with kitconcept volto-light-theme container widths @jackahl [#6](https://github.com/kitconcept/volto-logos-block/pull/6)

## 1.2.0 (2023-12-18)

### Feature

- add setting to show or not show description field @jackahl [#1](https://github.com/kitconcept/volto-logos-block/pull/1)

### Bugfix

- fix link element being rendered even when no link is set @jackahl [#1](https://github.com/kitconcept/volto-logos-block/pull/1)

## 1.1.1 (2023-12-15)

### Feature

- improve styling for layouts with less than four columns @jackahl [#1](https://github.com/kitconcept/volto-logos-block/pull/1)

## 1.0.0 (2023-12-06)

- initial release

## 1.1.0 (2023-12-13)

### Feature

- add german translations
- remove currently unused description field
- Add possibillity to link on Logo

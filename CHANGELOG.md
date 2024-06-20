# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.6.5](https://github.com/nativescript-community/text/compare/v1.6.4...v1.6.5) (2024-06-20)

### Bug Fixes

* **android:** html string not working in production builds ([e7f73a3](https://github.com/nativescript-community/text/commit/e7f73a3dd0de33b5951728cc4e80ddba2ea71312))

## [1.6.4](https://github.com/nativescript-community/text/compare/v1.6.3...v1.6.4) (2024-05-23)

### Bug Fixes

* **android:** another FontVariationSettings fix ([3c6620e](https://github.com/nativescript-community/text/commit/3c6620ec9b75a555217353abc42420b3dc665da4))

## [1.6.3](https://github.com/nativescript-community/text/compare/v1.6.2...v1.6.3) (2024-05-22)

### Bug Fixes

* typings fix for ui-label build ([d11b910](https://github.com/nativescript-community/text/commit/d11b910b0b6554cf4ad25293472d0899be56ee6f))

## [1.6.2](https://github.com/nativescript-community/text/compare/v1.6.1...v1.6.2) (2024-05-22)

**Note:** Version bump only for package text

## [1.6.1](https://github.com/nativescript-community/text/compare/v1.6.0...v1.6.1) (2024-05-22)

### Bug Fixes

* **ios:** build issues after PR merge ([595c3e8](https://github.com/nativescript-community/text/commit/595c3e8d0bfee6a4e68b2c0cd80a597c721d2eb8))

## [1.6.0](https://github.com/nativescript-community/text/compare/v1.5.47...v1.6.0) (2024-05-22)

### Features

* **android:** fontVariationSettings support ([34153f8](https://github.com/nativescript-community/text/commit/34153f8c453acdd1239072e7c982a31f4aeda642))

## [1.5.47](https://github.com/nativescript-community/text/compare/v1.5.46...v1.5.47) (2024-03-18)

### Bug Fixes

* **ios:** formattedText on button was broken ([597156b](https://github.com/nativescript-community/text/commit/597156badd5da78b8458a47c14077029f62623cd))

## [1.5.46](https://github.com/nativescript-community/text/compare/v1.5.45...v1.5.46) (2024-01-26)

### Bug Fixes

* **android:** verticalAlignment fix for `Span` within `FormattedString` ([2ecf386](https://github.com/nativescript-community/text/commit/2ecf38643196db8a8829e4f7afa2228a39ded1c9))

## [1.5.45](https://github.com/nativescript-community/text/compare/v1.5.44...v1.5.45) (2024-01-25)

### Bug Fixes

* **android:** refactor for plugins using text ([1645350](https://github.com/nativescript-community/text/commit/16453504485f9d23e64321f0f2a113a5628647a1))

## [1.5.44](https://github.com/nativescript-community/text/compare/v1.5.43...v1.5.44) (2024-01-23)

### Bug Fixes

* **android:** faster implementation ([f8bc934](https://github.com/nativescript-community/text/commit/f8bc93480df2d6db0e6cb508e6adecd62b2bc0c4))

## [1.5.43](https://github.com/nativescript-community/text/compare/v1.5.42...v1.5.43) (2024-01-19)

### Bug Fixes

* **android:** rewrote text scaling again. This time it seems to work almost perfectly (still a slight difference between Canvas and TextView drawing) ([929cc3c](https://github.com/nativescript-community/text/commit/929cc3c01b55eb8f3f72f1f7f71da89fe9e2b01f))

## [1.5.42](https://github.com/nativescript-community/text/compare/v1.5.41...v1.5.42) (2024-01-18)

### Bug Fixes

* **android:** font size working also with ui-canvas and ui-canvaslabel ([97acb20](https://github.com/nativescript-community/text/commit/97acb2035d74380a3621bccd8392e2dd4cd1a189))

## [1.5.41](https://github.com/nativescript-community/text/compare/v1.5.40...v1.5.41) (2024-01-18)

### Bug Fixes

* **android:** html font size was a bit "off size" compared to normal text ([12586fd](https://github.com/nativescript-community/text/commit/12586fd72bd5978e099b8593cca2029cd457a42e))
* **android:** white color in spans could be ignored ([bf9f2a3](https://github.com/nativescript-community/text/commit/bf9f2a352d8915189840e58db647479965e3eec6))
* improved span details handling ([4f3bbbb](https://github.com/nativescript-community/text/commit/4f3bbbba0a14920a16abd4d32a7d206fd08cec8f))

## [1.5.40](https://github.com/nativescript-community/text/compare/v1.5.39...v1.5.40) (2024-01-18)

### Bug Fixes

* **android:** font size for spans was not correct (a bit too small) ([6ebc2a8](https://github.com/nativescript-community/text/commit/6ebc2a863f4418db5ce5bad291465ab22f42ed1c))

## [1.5.39](https://github.com/nativescript-community/text/compare/v1.5.38...v1.5.39) (2024-01-16)

### Bug Fixes

* **ios:** another ay11n sizing fix ([89cc5e6](https://github.com/nativescript-community/text/commit/89cc5e67ca73249b03f188aba747c02e1a080eb8))

## [1.5.38](https://github.com/nativescript-community/text/compare/v1.5.37...v1.5.38) (2024-01-16)

### Bug Fixes

* **ios:** ios-a11y-adjusts-font-size support ([e1118ab](https://github.com/nativescript-community/text/commit/e1118ab82e6552046b8c291227631f1021a11b92))
* **ios:** let the parent decide of the font if none is needed ([11f0829](https://github.com/nativescript-community/text/commit/11f0829ab5974a8414b2236b96ea43222df82369))

## [1.5.37](https://github.com/nativescript-community/text/compare/v1.5.36...v1.5.37) (2024-01-06)

### Bug Fixes

* ensure we get properties inheritance from parent view ([1ae0336](https://github.com/nativescript-community/text/commit/1ae0336cc4bba036d3f0bd88260ad92f1e099491))

## [1.5.36](https://github.com/nativescript-community/text/compare/v1.5.35...v1.5.36) (2024-01-05)

### Bug Fixes

* type casting for Swift ([6a1cbb4](https://github.com/nativescript-community/text/commit/6a1cbb4c26705b97d91a033acd52e082e19a49c6))

## [1.5.35](https://github.com/nativescript-community/text/compare/v1.5.34...v1.5.35) (2023-11-24)

**Note:** Version bump only for package nativescript-text

## [1.5.34](https://github.com/nativescript-community/text/compare/v1.5.33...v1.5.34) (2023-11-23)

### Bug Fixes

* **ios:** build warning fixes ([65b48d0](https://github.com/nativescript-community/text/commit/65b48d03d4ef7f678ed3d3a02528ca08510f1a9c))
* **ios:** crash when no parentView ([c4feaba](https://github.com/nativescript-community/text/commit/c4feaba2f61931362a50b39cb5e00bf0d69c852c))
* **ios:** trying to fix color hoping to not break anythign ([c2cbaf9](https://github.com/nativescript-community/text/commit/c2cbaf9db0a5baff1b750ec5feb56e4ff4ee3429))

## [1.5.33](https://github.com/nativescript-community/text/compare/v1.5.32...v1.5.33) (2023-09-06)

### Bug Fixes

* **android:** use int instead of android.graphics.Color to fix issue on older Android < 26 ([259dfa9](https://github.com/nativescript-community/text/commit/259dfa912f7f25656a2041c03e23e9e73fc9b0ba))

## [1.5.32](https://github.com/nativescript-community/text/compare/v1.5.31...v1.5.32) (2023-09-01)

### Bug Fixes

* **android:** allow spaces in html strings ([fb03d0e](https://github.com/nativescript-community/text/commit/fb03d0e9a0f06c1c161539896a3700de4fe8c151))

## [1.5.31](https://github.com/nativescript-community/text/compare/v1.5.30...v1.5.31) (2023-06-16)

### Bug Fixes

* **ios:** text not applied on TextFied, TextView … ([529875b](https://github.com/nativescript-community/text/commit/529875b8f9dec5a637770dd3e7ad6338776cd180))

## [1.5.30](https://github.com/nativescript-community/text/compare/v1.5.29...v1.5.30) (2023-06-12)

### Bug Fixes

* **android:** TextView measures to height 0 if no text ([d7afb6f](https://github.com/nativescript-community/text/commit/d7afb6ff6883a849dacf4d16558d241eaa3c0663))

## [1.5.29](https://github.com/nativescript-community/text/compare/v1.5.28...v1.5.29) (2023-06-06)

### Bug Fixes

* **android:** crash in latest N versions ([de9bb16](https://github.com/nativescript-community/text/commit/de9bb1605f53774b85dfbd2835c5b75e53bafe9b))

## [1.5.28](https://github.com/nativescript-community/text/compare/v1.5.27...v1.5.28) (2023-05-25)

### Bug Fixes

* **android:** regresssions fix ([ad68644](https://github.com/nativescript-community/text/commit/ad686448e4c87ffb989a5248316d93171f6da7e0))

## [1.5.27](https://github.com/nativescript-community/text/compare/v1.5.26...v1.5.27) (2023-05-24)

### Bug Fixes

* **android:** crash fix with uglify ([7879069](https://github.com/nativescript-community/text/commit/787906929f7e20f8c2dc9d8399fdbf1f6c390416))

## [1.5.26](https://github.com/nativescript-community/text/compare/v1.5.25...v1.5.26) (2023-05-24)

### Bug Fixes

* **android:** proguard fix ([834e5c7](https://github.com/nativescript-community/text/commit/834e5c74368b0cb0b4eac56162dc7f6ea8b9e331))

## [1.5.25](https://github.com/nativescript-community/text/compare/v1.5.24...v1.5.25) (2023-05-16)

### Bug Fixes

* **android:** more fixes for canvaslabel ([70875ae](https://github.com/nativescript-community/text/commit/70875ae4fe0670698288a5207b350f9fe9f06a1e))

## [1.5.24](https://github.com/nativescript-community/text/compare/v1.5.23...v1.5.24) (2023-05-16)

**Note:** Version bump only for package nativescript-text

## [1.5.23](https://github.com/nativescript-community/text/compare/v1.5.22...v1.5.23) (2023-05-16)

**Note:** Version bump only for package nativescript-text

## [1.5.22](https://github.com/nativescript-community/text/compare/v1.5.21...v1.5.22) (2023-05-16)

### Bug Fixes

* **android:** fix for canvaslabel ([6e7b420](https://github.com/nativescript-community/text/commit/6e7b42009e806e2d4e4f5c78049816d97b5d5092))

## [1.5.21](https://github.com/nativescript-community/text/compare/v1.5.20...v1.5.21) (2023-05-16)

### Bug Fixes

* **android:** linkColor broken after last version ([f920507](https://github.com/nativescript-community/text/commit/f92050747929a4db7948dff0e20cad22fcf63a2c))

## [1.5.20](https://github.com/nativescript-community/text/compare/v1.5.19...v1.5.20) (2023-05-13)

**Note:** Version bump only for package nativescript-text

## [1.5.19](https://github.com/nativescript-community/text/compare/v1.5.18...v1.5.19) (2023-05-12)

### Bug Fixes

* **android:** faster span/html creation ([58ae027](https://github.com/nativescript-community/text/commit/58ae027b752e21d2393d0f6eaf5d32f6695dd023))
* **ios:** faster TextBase components ([ec88f53](https://github.com/nativescript-community/text/commit/ec88f53bcfdd36c001d21a17f067ae165b6ccccb))
* **ios:** handle null text or hidden spans ([a3a4309](https://github.com/nativescript-community/text/commit/a3a43098c45af2574d5005aa22697c5bf85e6d8f))

## [1.5.18](https://github.com/nativescript-community/text/compare/v1.5.17...v1.5.18) (2023-05-11)

### Bug Fixes

* **ios:** bring back `createSpannable` ([cb89543](https://github.com/nativescript-community/text/commit/cb89543ee15d111a958485db82f14284c7628004))
* **ios:** parent properties not being used ([4d0cb6b](https://github.com/nativescript-community/text/commit/4d0cb6b4e502088f5c4ac7e9e90550f60f20197d))

## [1.5.17](https://github.com/nativescript-community/text/compare/v1.5.16...v1.5.17) (2023-05-10)

### Bug Fixes

* know if LightFormattedString is used ([6199859](https://github.com/nativescript-community/text/commit/619985924d1d46e20ba93d6fb443e8413a371f20))

## [1.5.16](https://github.com/nativescript-community/text/compare/v1.5.15...v1.5.16) (2023-05-10)

### Bug Fixes

* allow to override without using LightFormattedString ([5a0ffd1](https://github.com/nativescript-community/text/commit/5a0ffd1e10f41be9230394e171fe7c11b9db5bef))

## [1.5.15](https://github.com/nativescript-community/text/compare/v1.5.14...v1.5.15) (2023-05-10)

**Note:** Version bump only for package nativescript-text

## [1.5.14](https://github.com/nativescript-community/text/compare/v1.5.13...v1.5.14) (2023-05-05)

### Bug Fixes

* **ios:** correctly handle paragraphStyle ([31db03e](https://github.com/nativescript-community/text/commit/31db03ed627e789cb070dd53ad4e3e043715e293))

## [1.5.13](https://github.com/nativescript-community/text/compare/v1.5.12...v1.5.13) (2023-05-05)

### Bug Fixes

* **ios:** added support for lineBreak and drop DTCoreText for now ([f45ec38](https://github.com/nativescript-community/text/commit/f45ec38dd6cf82124a00d48e87dd56c4fcc7265e))

## [1.5.12](https://github.com/nativescript-community/text/compare/v1.5.11...v1.5.12) (2023-03-07)

### Bug Fixes

* error when used with N main repo ([7fa8a98](https://github.com/nativescript-community/text/commit/7fa8a9858ee786bd7fc2e61eb1fdb3e31dcc7b00))
* **ios:** override working with N official ([67cca8c](https://github.com/nativescript-community/text/commit/67cca8ce105f9d01951c81812eb276ef011e514e))

## [1.5.11](https://github.com/nativescript-community/text/compare/v1.5.10...v1.5.11) (2022-12-03)

### Bug Fixes

-   **android:** dont use deref ([a7ef8f9](https://github.com/nativescript-community/text/commit/a7ef8f947ce19ae34cbd404bed556284f8ef501c))

## [1.5.10](https://github.com/nativescript-community/text/compare/v1.5.9...v1.5.10) (2022-12-01)

**Note:** Version bump only for package @nativescript-community/text

## [1.5.9](https://github.com/nativescript-community/text/compare/v1.5.8...v1.5.9) (2022-09-16)

### Bug Fixes

-   **ios:** bring back NSLinkAttributeName ([ee12352](https://github.com/nativescript-community/text/commit/ee12352c045571b83b4baf8b344cf249a19fac80))

## [1.5.8](https://github.com/nativescript-community/text/compare/v1.5.7...v1.5.8) (2022-09-14)

**Note:** Version bump only for package @nativescript-community/text

## [1.5.7](https://github.com/nativescript-community/text/compare/v1.5.6...v1.5.7) (2022-08-21)

### Bug Fixes

-   **android:** dont render spans with `visibility:hidden|collapsed` ([39dfeba](https://github.com/nativescript-community/text/commit/39dfeba51139b4404d9d88b44b156111d0d1e7ad))

## [1.5.6](https://github.com/nativescript-community/text/compare/v1.5.5...v1.5.6) (2022-05-10)

### Bug Fixes

-   **ios:** span verticalAlignment fix ([c2d7821](https://github.com/nativescript-community/text/commit/c2d78211d8c1bd72f2a12fb912a702854353f56f))

## [1.5.5](https://github.com/nativescript-community/text/compare/v1.5.4...v1.5.5) (2022-05-09)

### Bug Fixes

-   **android:** build fix ([9603b7f](https://github.com/nativescript-community/text/commit/9603b7ff2270f10b44b88a52cc28c441a4c0c994))

## [1.5.4](https://github.com/nativescript-community/text/compare/v1.5.3...v1.5.4) (2022-05-08)

### Bug Fixes

-   **android:** catch natige getFont error ([d68d43d](https://github.com/nativescript-community/text/commit/d68d43d77783ebcc6144d35ccbd418b71a94a8fb))
-   **android:** get context fix ([1f61007](https://github.com/nativescript-community/text/commit/1f6100742e2330404ee54887970a1ca0c8b773a6))

## [1.5.3](https://github.com/nativescript-community/text/compare/v1.5.2...v1.5.3) (2022-03-03)

### Bug Fixes

-   `View` `verticalTextAlignment` should not be transfered to `Span` ([dc04d0c](https://github.com/nativescript-community/text/commit/dc04d0cbea62f207d0af870a5dd3748dd45407d4))

## [1.5.2](https://github.com/nativescript-community/text/compare/v1.5.1...v1.5.2) (2022-02-25)

### Bug Fixes

-   allow canvaslabel Span to be used in Button/Label … ([58c9af8](https://github.com/nativescript-community/text/commit/58c9af86b36d03ae9b88d527d16351fce033b456))

## [1.5.1](https://github.com/nativescript-community/text/compare/v1.5.0...v1.5.1) (2022-02-18)

### Bug Fixes

-   rollback on change spans and parentView style ([87d47e1](https://github.com/nativescript-community/text/commit/87d47e185ba8cd8c86902427f88918fb874dec90))

# [1.5.0](https://github.com/nativescript-community/text/compare/v1.4.39...v1.5.0) (2022-02-14)

### Features

-   **android:** native-api-usage ([8fa8ab9](https://github.com/nativescript-community/text/commit/8fa8ab99da9911f52c11872246bd602078881c70))

## [1.4.39](https://github.com/nativescript-community/text/compare/v1.4.38...v1.4.39) (2022-02-14)

### Bug Fixes

-   **android:** another try at lineHeight fix ([88cf5ba](https://github.com/nativescript-community/text/commit/88cf5bac727596c6746da27ebc3c0cae35023611))
-   **ios:** verticalTextAlignment fix ([1e1b602](https://github.com/nativescript-community/text/commit/1e1b60211085f528728425cfcb5757764a7bdb55))
-   typings fix ([c7deb78](https://github.com/nativescript-community/text/commit/c7deb78b73ffe02a23f0f5af7a2b01cf4e705455))

## [1.4.38](https://github.com/nativescript-community/text/compare/v1.4.37...v1.4.38) (2022-02-14)

### Bug Fixes

-   **android:** fix missing class for createSpannable from JS ([a871967](https://github.com/nativescript-community/text/commit/a8719673ca84530724cd370db07edf1b21924d59))
-   **android:** full support for canvaslabel CSpan ([aab6753](https://github.com/nativescript-community/text/commit/aab6753631c8ff8ed35796479e733ee18841ae06))

## [1.4.37](https://github.com/nativescript-community/text/compare/v1.4.36...v1.4.37) (2022-02-09)

### Bug Fixes

-   bring back span property changes listeners ([9cdf5f5](https://github.com/nativescript-community/text/commit/9cdf5f5040411e70c011a760412532380486378a))

## [1.4.36](https://github.com/nativescript-community/text/compare/v1.4.35...v1.4.36) (2022-02-09)

### Bug Fixes

-   **ios:** UIButton behaves differently ([f2a3452](https://github.com/nativescript-community/text/commit/f2a3452ed57c4713410c0d617e931b97e4fac15c))

## [1.4.35](https://github.com/nativescript-community/text/compare/v1.4.34...v1.4.35) (2022-02-09)

### Bug Fixes

-   **ios:** dont get color from parentView. breaks changing parentView color ([a969b56](https://github.com/nativescript-community/text/commit/a969b565519bdf7d5787549ea27995aca0726682))

## [1.4.34](https://github.com/nativescript-community/text/compare/v1.4.33...v1.4.34) (2022-02-08)

### Bug Fixes

-   **android:** fixes for `createNativeAttributedString` from object conforming to `FormattedString` ([275abb0](https://github.com/nativescript-community/text/commit/275abb0a50557462266432ad65b3547a2321da3f))

## [1.4.33](https://github.com/nativescript-community/text/compare/v1.4.32...v1.4.33) (2022-02-08)

### Features

-   allow to create native strings with `createNativeAttributedString` from an object conforming to `FormattedString` ([a404cae](https://github.com/nativescript-community/text/commit/a404caeaf960264834b52d635792c3da26a1dac6))

## [1.4.32](https://github.com/nativescript-community/text/compare/v1.4.31...v1.4.32) (2022-01-14)

### Bug Fixes

-   uglify fix ([686880e](https://github.com/nativescript-community/text/commit/686880e6f0664dbeb2398d99c28f0dee77208824))

## [1.4.31](https://github.com/nativescript-community/text/compare/v1.4.30...v1.4.31) (2022-01-11)

### Bug Fixes

-   **android:** build fix ([2b24e64](https://github.com/nativescript-community/text/commit/2b24e64030650202de6df349c62ea4ea8e730379))

## [1.4.30](https://github.com/nativescript-community/text/compare/v1.4.29...v1.4.30) (2022-01-11)

### Bug Fixes

-   **android:** span lineHeight fix ([ef0d20c](https://github.com/nativescript-community/text/commit/ef0d20c93d6059401f1b24468f1a4c16cb63c0aa))

## [1.4.29](https://github.com/nativescript-community/text/compare/v1.4.28...v1.4.29) (2022-01-02)

### Bug Fixes

-   lineHeight fix and support 0 ([bb5f92b](https://github.com/nativescript-community/text/commit/bb5f92b6e027a49135f407313b7628963cfc92b6))
-   **ios:** correctly set paragraphStyle if need be ([8f89dee](https://github.com/nativescript-community/text/commit/8f89deeb98a8dcde8917cf5227e90ad2546169cc))
-   dont force verticalTextAlignment from parentView ([f89fcf6](https://github.com/nativescript-community/text/commit/f89fcf6bf47b01122590a664ec56b9f01187ed17))
-   **android:** correct letterSpacing on android >= 21 ([5e8b458](https://github.com/nativescript-community/text/commit/5e8b458cdc630d5c0d80e5897d7fca4c2f11a07e))

## [1.4.28](https://github.com/nativescript-community/text/compare/v1.4.27...v1.4.28) (2021-11-02)

### Bug Fixes

-   **ios:** allow verticalTextAlignment from parent view ([cac9784](https://github.com/nativescript-community/text/commit/cac9784c174a61d515be37180f7b3a1d2376e7b1))

## [1.4.27](https://github.com/nativescript-community/text/compare/v1.4.26...v1.4.27) (2021-11-02)

### Bug Fixes

-   **ios:** allow to get verticalTextAlignment from parent ([832dd0b](https://github.com/nativescript-community/text/commit/832dd0b24bd1f9603cdbca2bf971deda6f9fc9a0))
-   **ios:** fix span verticalTextAlignment in some cases ([3b9af40](https://github.com/nativescript-community/text/commit/3b9af406920cf99b53ccbfeeed3c4a509e26243f))

## [1.4.26](https://github.com/nativescript-community/text/compare/v1.4.25...v1.4.26) (2021-10-28)

### Bug Fixes

-   **android:** font weight fix on older phones ([82f9cad](https://github.com/nativescript-community/text/commit/82f9cad2be102fbdd98a4b33c34843b1edeb30d6))

## [1.4.25](https://github.com/nativescript-community/text/compare/v1.4.24...v1.4.25) (2021-10-20)

### Bug Fixes

-   verticalAlignment fix ([95f3b48](https://github.com/nativescript-community/text/commit/95f3b484c30fc7b1e2bcea72e292fe516e5ae49e))

## [1.4.24](https://github.com/nativescript-community/text/compare/v1.4.23...v1.4.24) (2021-10-13)

### Bug Fixes

-   **android:** better handle of custom fonts weight and style on < 28 ([4a86789](https://github.com/nativescript-community/text/commit/4a86789173cda4995a1f296b3f2ecbc90fe77616))

## [1.4.23](https://github.com/nativescript-community/text/compare/v1.4.22...v1.4.23) (2021-10-04)

### Bug Fixes

-   **android:** ensure we have androidx.core ([f1d52fc](https://github.com/nativescript-community/text/commit/f1d52fc7abf2859b0d475bee8bbe87cd3e69db17))
-   **android:** fix for when using LightFormattedString ([63d74e8](https://github.com/nativescript-community/text/commit/63d74e86f126db58859fb8d03f66091f10cda9fb))

## [1.4.22](https://github.com/nativescript-community/text/compare/v1.4.21...v1.4.22) (2021-08-10)

### Bug Fixes

-   **android:** fixes to span computation ([ac28660](https://github.com/nativescript-community/text/commit/ac28660582a4974ee214b8e5ed4c5a9876a09864))

## [1.4.21](https://github.com/nativescript-community/text/compare/v1.4.20...v1.4.21) (2021-08-09)

### Features

-   span relativeSize support ([3618fc7](https://github.com/nativescript-community/text/commit/3618fc77a3033017c13b4755212563c3b7f174d3))

## [1.4.20](https://github.com/nativescript-community/text/compare/v1.4.19...v1.4.20) (2021-08-07)

### Bug Fixes

-   **ios:** autoFontSize and color fixes ([d3d4a6a](https://github.com/nativescript-community/text/commit/d3d4a6aed304c294fea2ca9c69f6b1a3f78342b0))

## [1.4.19](https://github.com/nativescript-community/text/compare/v1.4.18...v1.4.19) (2021-08-06)

### Bug Fixes

-   usingiOSUseDTCoreText method ([6f3e1b2](https://github.com/nativescript-community/text/commit/6f3e1b207689752f80c98f65403bdd15e31b96c2))

## [1.4.18](https://github.com/nativescript-community/text/compare/v1.4.17...v1.4.18) (2021-08-04)

### Bug Fixes

-   **ios:** fix error if null ([4769b04](https://github.com/nativescript-community/text/commit/4769b0488e79e81626d7b014c839205414626387))

## [1.4.17](https://github.com/nativescript-community/text/compare/v1.4.16...v1.4.17) (2021-08-04)

### Bug Fixes

-   **android:** take parent fontFamily into account ([9b82b82](https://github.com/nativescript-community/text/commit/9b82b82c64f40b44b5a7ad545f1c04465c9c8208))

## [1.4.16](https://github.com/nativescript-community/text/compare/v1.4.15...v1.4.16) (2021-08-04)

### Bug Fixes

-   **ios:** correctly handle parent font parameters ([97d1766](https://github.com/nativescript-community/text/commit/97d176686ecc2f44937b212356ceb375b11ab507))
-   html conversion better parameters ([a23f47b](https://github.com/nativescript-community/text/commit/a23f47b7d0486ca8d7a6739e66fe8815f132730b))

## [1.4.15](https://github.com/nativescript-community/text/compare/v1.4.14...v1.4.15) (2021-08-04)

### Bug Fixes

-   **ios:** overrideSpanAndFormattedString supports linkTap ([4babed3](https://github.com/nativescript-community/text/commit/4babed34d20fb3080c233a062065dffd8667e9de))

## [1.4.14](https://github.com/nativescript-community/text/compare/v1.4.13...v1.4.14) (2021-08-03)

### Bug Fixes

-   **android:** default font with “undefined” font family ([44dbd97](https://github.com/nativescript-community/text/commit/44dbd972b38e6965f1cb5e151772096886d5a658))
-   **android:** textTransform fix ([b81ed10](https://github.com/nativescript-community/text/commit/b81ed10542903f75d4d66e194f123af012ed18e0))

## [1.4.13](https://github.com/nativescript-community/text/compare/v1.4.12...v1.4.13) (2021-07-16)

### Bug Fixes

-   ensure we check for object existence ([1207f92](https://github.com/nativescript-community/text/commit/1207f929ec545cc2ec5018a66ef3ef09e7245175))

## [1.4.12](https://github.com/nativescript-community/text/compare/v1.4.11...v1.4.12) (2021-07-01)

### Bug Fixes

-   fixe for LightFormattedString ([b81660d](https://github.com/nativescript-community/text/commit/b81660d20e602d6b18c1ae98e2e6a478288e98d2))
-   **ios:** fixes for overrideSpanAndFormattedString ([dcb26ab](https://github.com/nativescript-community/text/commit/dcb26ab9ba2a4e8af941e96759cc04862e36de71))

## [1.4.11](https://github.com/nativescript-community/text/compare/v1.4.10...v1.4.11) (2021-04-14)

**Note:** Version bump only for package @nativescript-community/text

## [1.4.10](https://github.com/nativescript-community/text/compare/v1.4.9...v1.4.10) (2021-04-14)

### Features

-   overrideSpanAndFormattedString now allows for better span rendering ([83eeaeb](https://github.com/nativescript-community/text/commit/83eeaebbd8f7e8b65f2361f30fe167c130e87681))

## [1.4.9](https://github.com/nativescript-community/text/compare/v1.4.8...v1.4.9) (2021-03-16)

### Bug Fixes

-   support fontWeight on html text ([842bdf5](https://github.com/nativescript-community/text/commit/842bdf566bd1f676ac082d3329f21c42775f549b))

## [1.4.8](https://github.com/nativescript-community/text/compare/v1.4.7...v1.4.8) (2021-03-13)

### Bug Fixes

-   **android:** prevent cras ([a0a87fd](https://github.com/nativescript-community/text/commit/a0a87fd8c887a5366ca03030c485d541c21a5451))

## [1.4.7](https://github.com/nativescript-community/text/compare/v1.4.6...v1.4.7) (2021-03-13)

### Bug Fixes

-   **android:** fix for css transforming font names res/ with res, ([7852ccb](https://github.com/nativescript-community/text/commit/7852ccbad95eda6d30ba9cfe3b56cadde109d857))

## [1.4.6](https://github.com/nativescript-community/text/compare/v1.4.5...v1.4.6) (2021-03-08)

### Bug Fixes

-   init function to ensure override are called ([2519261](https://github.com/nativescript-community/text/commit/2519261d3a2c68b33d97def5683b0084635a0151))

## [1.4.5](https://github.com/nativescript-community/text/compare/v1.4.4...v1.4.5) (2021-02-20)

### Bug Fixes

-   **android:** cache fonts ([5fa8eaf](https://github.com/nativescript-community/text/commit/5fa8eaf74dadbae4827878613ce1584bbe289d13))

## [1.4.4](https://github.com/nativescript-community/text/compare/v1.4.3...v1.4.4) (2021-02-15)

**Note:** Version bump only for package @nativescript-community/text

## [1.4.3](https://github.com/nativescript-community/text/compare/v1.4.2...v1.4.3) (2021-02-12)

**Note:** Version bump only for package @nativescript-community/text

## [1.4.2](https://github.com/nativescript-community/text/compare/v1.4.1...v1.4.2) (2021-02-12)

**Note:** Version bump only for package @nativescript-community/text

## [1.4.1](https://github.com/nativescript-community/text/compare/v1.4.0...v1.4.1) (2021-02-12)

### Bug Fixes

-   **android:** remove unwanted logs ([7003d13](https://github.com/nativescript-community/text/commit/7003d13df1654002aad363e1f9bbe54abdce4a58))

# [1.4.0](https://github.com/nativescript-community/text/compare/v1.3.11...v1.4.0) (2021-02-12)

### Features

-   **android:** support more span properties ([2d8b332](https://github.com/nativescript-community/text/commit/2d8b3324810529660358fd173d128efc580a6b52))

## [1.3.11](https://github.com/nativescript-community/text/compare/v1.3.10...v1.3.11) (2020-12-20)

### Bug Fixes

-   fixed support for LightFormattedString ([e1a58ad](https://github.com/nativescript-community/text/commit/e1a58ad6ba3f688d7319cedd0dc3982c846c6d23))

## [1.3.10](https://github.com/nativescript-community/text/compare/v1.3.9...v1.3.10) (2020-11-26)

### Bug Fixes

-   android crash while creating nativestring ([729589e](https://github.com/nativescript-community/text/commit/729589e63661efa63d350a7538c3e089e0cb5800))
-   ios fix ([0c01a9a](https://github.com/nativescript-community/text/commit/0c01a9a9be01ce18a0e2b4474770bb1ce4f3d786))

## [1.3.9](https://github.com/nativescript-community/text/compare/v1.3.8...v1.3.9) (2020-11-23)

**Note:** Version bump only for package @nativescript-community/text

## [1.3.8](https://github.com/nativescript-community/text/compare/v1.3.7...v1.3.8) (2020-11-22)

**Note:** Version bump only for package @nativescript-community/text

## [1.3.7](https://github.com/nativescript-community/text/compare/v1.3.6...v1.3.7) (2020-11-16)

### Bug Fixes

-   android disable default click handling ([b235362](https://github.com/nativescript-community/text/commit/b2353628475afaa151fd658809062860bdba493b))

## [1.3.6](https://github.com/nativescript-community/text/compare/v1.3.5...v1.3.6) (2020-10-29)

### Bug Fixes

-   ios fix ([b36cffa](https://github.com/nativescript-community/text/commit/b36cffa0ad6e1784f3377ae31d17e97887c98f96))

## [1.3.5](https://github.com/nativescript-community/text/compare/v1.3.4...v1.3.5) (2020-10-28)

### Bug Fixes

-   ios fix for override ([cb843d3](https://github.com/nativescript-community/text/commit/cb843d3e6f9cb7c0b640a25620b2cd9fbb14ef2d))

## [1.3.4](https://github.com/nativescript-community/text/compare/v1.3.3...v1.3.4) (2020-10-23)

### Features

-   allow to override N FormattedString and Span to be faster! (losing class support though) ([fe8a66b](https://github.com/nativescript-community/text/commit/fe8a66b85c444ada56bcbeb9f8cf89a39d268849))

## [1.3.3](https://github.com/nativescript-community/text/compare/v1.3.2...v1.3.3) (2020-10-11)

### Bug Fixes

-   android fix ([c48088f](https://github.com/nativescript-community/text/commit/c48088f202269e875f67113aa476bb845e896df1))

## [1.3.2](https://github.com/nativescript-community/text/compare/v1.3.1...v1.3.2) (2020-10-10)

**Note:** Version bump only for package @nativescript-community/text

## [1.3.1](https://github.com/nativescript-community/text/compare/v1.3.0...v1.3.1) (2020-10-10)

### Bug Fixes

-   ios crash fix ([56be019](https://github.com/nativescript-community/text/commit/56be01930122e9629fdde3e6a743e76161ecdb8b))

# [1.3.0](https://github.com/nativescript-community/text/compare/v1.2.5...v1.3.0) (2020-10-09)

### Features

-   moved features from label to here ([0e986ea](https://github.com/nativescript-community/text/commit/0e986ea50b672ac58693cb50c7eb47bacaa9dd91))

## 1.2.5 (2020-10-08)

**Note:** Version bump only for package @nativescript-community/text

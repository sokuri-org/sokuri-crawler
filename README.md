# 🧺 SOKURI

사용자가 URL만 입력하면, 실제 가방 사이즈 기반으로 물건을 넣어볼 수 있는 IOS 어플리케이션 입니다. <br>
실제 가방이 없어도 모바일 기기에서 다양한 물건들을 넣어보며 수납 가능 여부를 직관적으로 확인할 수 있습니다.

<br>

<!-- toc -->

- [🔥 Motivation](#-motivation)
- [🖼️ Preview](#-preview)
- [🔧 Tech stack](#-tech-stack)
  * [어플리케이션 📱](#%EC%96%B4%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98-%F0%9F%93%B1)
  * [서버 및 크롤링 🌐](#%EC%84%9C%EB%B2%84-%EB%B0%8F-%ED%81%AC%EB%A1%A4%EB%A7%81-%F0%9F%8C%90)
  * [머신러닝 및 이미지 분석 🤖](#%EB%A8%B8%EC%8B%A0%EB%9F%AC%EB%8B%9D-%EB%B0%8F-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B6%84%EC%84%9D-%F0%9F%A4%96)
- [💻 Development](#-development)
  * [1. 후기 이미지에서 어떻게 실제 사이즈를 추정할 수 있을까?](#1-%ED%9B%84%EA%B8%B0-%EC%9D%B4%EB%AF%B8%EC%A7%80%EC%97%90%EC%84%9C-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%8B%A4%EC%A0%9C-%EC%82%AC%EC%9D%B4%EC%A6%88%EB%A5%BC-%EC%B6%94%EC%A0%95%ED%95%A0-%EC%88%98-%EC%9E%88%EC%9D%84%EA%B9%8C)
    + [1.1 후기 이미지를 크롤링하고 분석해 실제 사이즈를 추정](#11-%ED%9B%84%EA%B8%B0-%EC%9D%B4%EB%AF%B8%EC%A7%80%EB%A5%BC-%ED%81%AC%EB%A1%A4%EB%A7%81%ED%95%98%EA%B3%A0-%EB%B6%84%EC%84%9D%ED%95%B4-%EC%8B%A4%EC%A0%9C-%EC%82%AC%EC%9D%B4%EC%A6%88%EB%A5%BC-%EC%B6%94%EC%A0%95)
    + [1.2 후기 이미지가 없는 경우 직접 입력하도록 보완](#12-%ED%9B%84%EA%B8%B0-%EC%9D%B4%EB%AF%B8%EC%A7%80%EA%B0%80-%EC%97%86%EB%8A%94-%EA%B2%BD%EC%9A%B0-%EC%A7%81%EC%A0%91-%EC%9E%85%EB%A0%A5%ED%95%98%EB%8F%84%EB%A1%9D-%EB%B3%B4%EC%99%84)
    + [1.3 매번 사용자가 아이템을 등록해야 할까?](#13-%EB%A7%A4%EB%B2%88-%EC%82%AC%EC%9A%A9%EC%9E%90%EA%B0%80-%EC%95%84%EC%9D%B4%ED%85%9C%EC%9D%84-%EB%93%B1%EB%A1%9D%ED%95%B4%EC%95%BC-%ED%95%A0%EA%B9%8C)
  * [2. React Native에서 3D 시뮬레이션 구현이 가능할까?](#2-react-native%EC%97%90%EC%84%9C-3d-%EC%8B%9C%EB%AE%AC%EB%A0%88%EC%9D%B4%EC%85%98-%EA%B5%AC%ED%98%84%EC%9D%B4-%EA%B0%80%EB%8A%A5%ED%95%A0%EA%B9%8C)
    + [2.1 문제: React Native는 3D 시뮬레이션에 적합하지 않다](#21-%EB%AC%B8%EC%A0%9C-react-native%EB%8A%94-3d-%EC%8B%9C%EB%AE%AC%EB%A0%88%EC%9D%B4%EC%85%98%EC%97%90-%EC%A0%81%ED%95%A9%ED%95%98%EC%A7%80-%EC%95%8A%EB%8B%A4)
    + [2.2 아이디어: WebView 안에 Three.js를 렌더링하자](#22-%EC%95%84%EC%9D%B4%EB%94%94%EC%96%B4-webview-%EC%95%88%EC%97%90-threejs%EB%A5%BC-%EB%A0%8C%EB%8D%94%EB%A7%81%ED%95%98%EC%9E%90)
    + [2.3 구현: WebView와 React Native 간 양방향 통신 구조](#23-%EA%B5%AC%ED%98%84-webview%EC%99%80-react-native-%EA%B0%84-%EC%96%91%EB%B0%A9%ED%96%A5-%ED%86%B5%EC%8B%A0-%EA%B5%AC%EC%A1%B0)
    + [2.4 결과: RN 앱에서도 실시간 3D 시뮬레이션이 가능해졌다](#24-%EA%B2%B0%EA%B3%BC-rn-%EC%95%B1%EC%97%90%EC%84%9C%EB%8F%84-%EC%8B%A4%EC%8B%9C%EA%B0%84-3d-%EC%8B%9C%EB%AE%AC%EB%A0%88%EC%9D%B4%EC%85%98%EC%9D%B4-%EA%B0%80%EB%8A%A5%ED%95%B4%EC%A1%8C%EB%8B%A4)
- [🐛 Trouble Shooting](#%F0%9F%90%9B-trouble-shooting)
  * [1. WebView 내 3D 시뮬레이터가 화면 밖에 렌더링되는 문제](#1-webview-%EB%82%B4-3d-%EC%8B%9C%EB%AE%AC%EB%A0%88%EC%9D%B4%ED%84%B0%EA%B0%80-%ED%99%94%EB%A9%B4-%EB%B0%96%EC%97%90-%EB%A0%8C%EB%8D%94%EB%A7%81%EB%90%98%EB%8A%94-%EB%AC%B8%EC%A0%9C)
  * [2. WebView가 준비되기 전에 메시지가 전달되는 문제](#2-webview%EA%B0%80-%EC%A4%80%EB%B9%84%EB%90%98%EA%B8%B0-%EC%A0%84%EC%97%90-%EB%A9%94%EC%8B%9C%EC%A7%80%EA%B0%80-%EC%A0%84%EB%8B%AC%EB%90%98%EB%8A%94-%EB%AC%B8%EC%A0%9C)
  * [3. YOLO 감지 결과 기반 크기 추정 시 과대/과소 평가 문제](#3-yolo-%EA%B0%90%EC%A7%80-%EA%B2%B0%EA%B3%BC-%EA%B8%B0%EB%B0%98-%ED%81%AC%EA%B8%B0-%EC%B6%94%EC%A0%95-%EC%8B%9C-%EA%B3%BC%EB%8C%80%EA%B3%BC%EC%86%8C-%ED%8F%89%EA%B0%80-%EB%AC%B8%EC%A0%9C)
- [✨ User Experience](#-user-experience)
  * [1. 메인 화면에서 바로 검색 가능하도록 구현](#1-%EB%A9%94%EC%9D%B8-%ED%99%94%EB%A9%B4%EC%97%90%EC%84%9C-%EB%B0%94%EB%A1%9C-%EA%B2%80%EC%83%89-%EA%B0%80%EB%8A%A5%ED%95%98%EB%8F%84%EB%A1%9D-%EA%B5%AC%ED%98%84)
  * [2. 정보를 카드 UI로 요약해 한눈에 파악가능](#2-%EC%A0%95%EB%B3%B4%EB%A5%BC-%EC%B9%B4%EB%93%9C-ui%EB%A1%9C-%EC%9A%94%EC%95%BD%ED%95%B4-%ED%95%9C%EB%88%88%EC%97%90-%ED%8C%8C%EC%95%85%EA%B0%80%EB%8A%A5)
  * [3. 제스쳐 기반으로 아이템 변경 및 삭제](#3-%EC%A0%9C%EC%8A%A4%EC%B3%90-%EA%B8%B0%EB%B0%98%EC%9C%BC%EB%A1%9C-%EC%95%84%EC%9D%B4%ED%85%9C-%EB%B3%80%EA%B2%BD-%EB%B0%8F-%EC%82%AD%EC%A0%9C)
  * [4. 사이즈 수정 후에도 시뮬레이터와 항상 동기화되도록 적용](#4-%EC%82%AC%EC%9D%B4%EC%A6%88-%EC%88%98%EC%A0%95-%ED%9B%84%EC%97%90%EB%8F%84-%EC%8B%9C%EB%AE%AC%EB%A0%88%EC%9D%B4%ED%84%B0%EC%99%80-%ED%95%AD%EC%83%81-%EB%8F%99%EA%B8%B0%ED%99%94%EB%90%98%EB%8F%84%EB%A1%9D-%EC%A0%81%EC%9A%A9)
- [🪞 Retrospective](#-retrospective)

<!-- tocstop -->

<br>

# 🔥 Motivation

이번 개인 프로젝트는 **앱 환경에서의 직관적인 사용자 경험을 직접 설계하고 구현해보는 것**이 목표였습니다. 다음 세 가지를 주요 도전 과제로 설정했습니다.<br>

1. 제스처 기반 UI/UX를 직접 설계하고 구현하기
2.	URL 입력 → 가방 사이즈 추정 → 시뮬레이션 시각화로 이어지는 전체 흐름 구현하기
3.	기존 웹 개발 경험을 앱 환경에 맞게 재구성하고 확장해보기

웹 기준으로 개발 경험을 쌓아오면서, 앱의 터치를 기반으로 하는 상호작용은 보다 즉각적이고, 직접적으로 사용자에게 피드백을 제공한다고 느꼈습니다. 웹과 앱은 입력 방식과 사용자 피드백 구조가 다르기 때문에, 앱 환경에서 설계부터 기술적 접근까지 새로운 방법이 필요해보였습니다. 이러한 특징은 프로젝트의 목표들을 달성하고, 웹과 앱의 차이를 직접 체험하고 구조화해보는 경험이 될 것이라 생각했습니다.

기획 과정에서 온라인 쇼핑 중 가방 구매 시 겪었던 불편함이 떠올랐습니다. 대부분의 쇼핑몰은 가방의 가로·세로·높이 수치나 착용 이미지만 제공할 뿐, 내가 실제로 들고 다니는 물건들이 들어가는지는 판단하기 어려웠습니다. 사용자는 가방을 직접 사보거나, 리뷰를 통해 간접적으로 추정할 수밖에 없습니다.

일상에서 겪었던 불편함을 해결하기 위해, 가방의 수납 가능 여부를 앱에서 직관적으로 시각화하는 기능을 구현하고자 했습니다. 사용자가 직접 URL을 입력하고, 가방 크기를 조정하거나 시뮬레이션을 통해 물건의 적합 여부를 판단할 수 있도록 구성했습니다. 이 기능들이 유기적으로 연결되도록 구현하는 것이 이번 프로젝트의 목표였습니다.
<br>

# 🖼️ Preview

<p align=center>
<img width=300 alt="sokuri_main" src="https://github.com/user-attachments/assets/f5bfae34-d1c8-4476-ac6e-15f1b17c5411">
<img width=300 alt="sokuri_main" src="https://github.com/user-attachments/assets/37f2cc82-ad95-4a53-96cd-21c1de7d34b0">
<img width=300 alt="sokuri_main" src="https://github.com/user-attachments/assets/187df0e4-71ba-4854-ae68-029f7cdcce8c">
</p>

# 🔧 Tech stack
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zotero&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![WebView](https://img.shields.io/badge/WebView-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![YOLOv8](https://img.shields.io/badge/YOLOv8-FFB000?style=for-the-badge&logo=opencv&logoColor=white)
![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

## 어플리케이션 📱
- 개발 언어: React Native
- iOS 환경: Xcode (iOS 17), WebView 기반 UI
- 상태 관리: Zustand
- 3D 시뮬레이터: Three.js (WebView 내 React 렌더링)
- 오픈 소스 라이브러리: react-native-webview, react-native-gesture-handler, react-native-reanimated 등

## 서버 및 크롤링 🌐
- 웹 프레임워크: FastAPI
- 크롤링 도구: Puppeteer (Node.js)
- API 통신 방식: RESTful API

## 머신러닝 및 이미지 분석 🤖
- 개발 환경: Python
- 딥러닝 프레임워크: YOLOv8 (Ultralytics)
- 딥러닝 모델 포맷: PyTorch (.pt)

<br>

# 💻 Development

## 1. 후기 이미지에서 어떻게 실제 사이즈를 추정할 수 있을까?

대부분의 온라인 쇼핑몰은 가방의 가로, 세로, 높이 등 숫자 정보를 제공해줍니다. 사이즈 정보만으로 사용자는 실제로 사용하는 물건들이 해당 가방에 들어갈 수 있을지를 판단하기란 번거로운 작업입니다.

이 문제를 해결하고자 후기 이미지 속 가방과 기준 객체(A4, 손 등)의 상대적 크기를 분석하여, 실제 가방 크기를 유추하여 시뮬레이션으로 사용자에게 보여줍니다.

### 1.1 후기 이미지를 크롤링하고 분석해 실제 사이즈를 추정

사용자가 입력한 URL을 통해 해당 쇼핑몰의 후기 이미지를 크롤링합니다. 현재는 무신사와 지그재그를 지원하며, 각 쇼핑몰의 구조에 맞게 크롤러를 구성해 후기 이미지들을 수집합니다.

이후 YOLOv8 모델을 활용해 이미지에서 가방과 기준 객체(손, 카드, A4 용지 등)를 탐지합니다.

> YOLO는 이미지 속에서 특정 물체를 빠르게 찾아주는 인공지능 기술입니다.
> ‘You Only Look Once(한 번만 보면 된다)’의 줄임말로 사진을 한 번에 분석해 어떤
> 물체가 어디에 있는지를 한눈에 찾아낼 수 있는 것이 가장 큰 특징입니다.
<br>

기준 객체가 함께 있을 경우, 픽셀 단위의 크기를 실측 단위(cm)로 환산할 수 있어 정확한 추정이 가능합니다. 기준 객체가 없다면 카테고리별로 수집된 평균 사이즈 데이터를 기반으로 보정값을 적용합니다.

### 1.2 후기 이미지가 없는 경우 직접 입력하도록 보완
후기 이미지가 존재하지 않거나, 기준 객체가 함께 찍힌 이미지가 충분하지 않을 경우에는 시뮬레이션을 위한 가방 사이즈 추정이 불가능해지는 문제가 발생합니다.

해당 상품에 후기가 없거나 이미지가 부족한 경우, 사용자가 직접 사이즈를 입력할 수 있도록 폼을 제공합니다. 입력된 값은 즉시 WebView 기반 시뮬레이터로 전달되어, 실시간으로 가방 모델이 업데이트되고 수납 가능 여부를 확인할 수 있습니다.
대체 입력 경로를 마련함으로써, 이미지가 부족한 상품에 대해서도 직접적인 비교를 제공할 수 있도록 구성했습니다.

### 1.3 매번 사용자가 아이템을 등록해야 할까?

자주 사용되는 아이템들(노트북, 책, 텀블러 등)은 미리 등록되어 있습니다. 사용자는 해당 목록에서 선택만 하면 됩니다. 필요한 경우 아이템을 직접 등록할 수 있고, 등록한 아이템의 사이즈 변경도 가능합니다. 사용자의 입력 부담을 줄이면서 사이즈 변경 등 유연성을 확보했습니다.

<br>

## 2. React Native에서 3D 시뮬레이션 구현이 가능할까?

React Native는 기본적으로 2D 기반 UI 렌더링에 최적화되어 있습니다. WebGL이나 Three.js와 같은 3D 렌더링 라이브러리를 직접 사용할 수 있는 환경은 제한적입니다. 이 프로젝트는 ‘물건이 가방 안에 실제로 들어가는지’를 시각적으로 확인할 수 있는 3D 시뮬레이션 기능이 핵심이었기 때문에, React Native 에서 구현하는 방법이 필요했습니다.

### 2.1 문제: React Native는 3D 시뮬레이션에 적합하지 않다

기본적인 React Native는 환경에서는 WebGL 또는 Three.js와 같은 3D 라이브러리를 직접 활용하기 어렵습니다. native bridge를 통해 일부 기능은 가능하지만, 성능이나 확장성 측면에서 한계가 있었습니다.

### 2.2 아이디어: WebView 안에 Three.js를 렌더링하자

이를 해결하기 위해 WebView를 활용해 3D 시뮬레이터를 구현했습니다. WebView 내부는 React + Three.js로 구성되어 있으며, React Native는 이 WebView를 포함하는 외부 틀 역할을 담당합니다.

### 2.3 구현: WebView와 React Native 간 양방향 통신 구조

React Native 내부에 WebView를 삽입하고, WebView 안에서 Three.js를 사용하여 3D 렌더링을 수행하는 구조를 채택했습니다. WebView는 렌더링에 집중하고, React Native는 사용자 입력 및 상태 관리 역할을 분리하여 담당하도록 설계했습니다.

양방향 통신은 postMessage와 onMessage 메서드를 통해 구현되었으며, 다음과 같은 흐름으로 동작합니다

- React Native → WebView: 사용자가 입력한 가방 정보 및 아이템 목록을 전달하여 3D 씬을 구성합니다.
- WebView → React Native: 아이템 클릭, 삭제 등 사용자 인터랙션을 전달받아 상태를 갱신합니다.


```js
// React Native → WebView로 데이터 전달
webViewRef.current.postMessage(JSON.stringify({
  type: 'RENDER_PACKING',
  payload: { items, bag },
}));

// WebView → React Native로 이벤트 전달
window.ReactNativeWebView.postMessage(JSON.stringify({
  type: 'ITEM_SELECTED',
  payload: itemId,
}));
```

### 2.4 결과: RN 앱에서도 실시간 3D 시뮬레이션이 가능해졌다

React Native 앱에서도 실시간으로 반응하는 3D 시뮬레이션을 구현할 수 있었습니다. 웹 환경에서 사용하던 Three.js 기반의 렌더링 방식을 모바일에서도 적용할 수 있었고, 이를 통해 사용자는 실제 가방 없이도 다양한 물건을 자유롭게 배치해보며 수납 가능 여부를 직관적으로 확인할 수 있게 되었습니다.

다음은 소쿠리 프로젝트의 README 문체와 구조에 맞춘 트러블슈팅 세 가지 항목입니다. 각 항목은 문제 인식 → 원인 분석 → 해결 과정 → 결과 흐름을 따르며, 기술적인 맥락과 직접적인 원인 분석을 포함하도록 구성했습니다.

<br>

# 🐛 Trouble Shooting

## 1. WebView 내 3D 시뮬레이터가 화면 밖에 렌더링되는 문제

초기 로딩 시, 가방이 카메라 시야 밖에 위치해 사용자에게 아무것도 보이지 않는 현상이 발생했습니다.

React Native WebView 안에서 Three.js 기반 3D 씬을 렌더링하던 초기 단계에서, 가방이 정상적으로 로딩되었음에도 화면에는 아무것도 보이지 않는 현상을 발견했습니다. 개발자 도구로 확인한 결과, 모델은 정상 위치에 배치되었지만 카메라의 초기 위치가 씬의 중심을 제대로 바라보지 않고 있었습니다.

문제의 핵심은 렌더링 타이밍과 카메라 포커싱 로직이 분리되어 동작한다는 점이었습니다. 특히 아이템이 여러 개일 경우, 전체 모델이 로딩되기까지 시간이 필요했지만 카메라 위치는 이보다 먼저 결정되어 초기 시야 계산이 틀어졌습니다.

이를 해결하기 위해 다음과 같은 보정 로직을 적용했습니다:
- 모든 아이템 및 가방이 로딩된 이후 BoundingBox 정보를 계산
- 해당 BoundingBox의 중심점과 크기를 기준으로 카메라 위치를 재계산
- fitToView 방식으로 씬 전체가 자동으로 중앙에 들어오도록 조정


```js
const box = new THREE.Box3().setFromObject(scene)
const center = box.getCenter(new THREE.Vector3())
camera.position.set(center.x, center.y, box.getSize(new THREE.Vector3()).length() * 1.2)
controls.target.copy(center)
```

가방이나 아이템 초기 진입 시 항상 중앙에 잘 맞춰진 상태로 렌더링되었습니다.

<br>

## 2. WebView가 준비되기 전에 메시지가 전달되는 문제

React Native에서 postMessage를 보내도 WebView가 아직 준비되지 않아 메시지를 무시하는 현상이 발생했습니다.

React Native ↔ WebView 간 데이터 전달은 postMessage와 onMessage를 통해 이루어집니다. 그러나 실제 환경에서는 React Native 앱이 WebView를 마운트하자마자 메시지를 보내는 경우가 있어, WebView 측 스크립트가 아직 준비되지 않은 상태에서 메시지가 전달되며 무시되는 문제가 발생했습니다.

처음에는 메시지 형식을 확인하거나, WebView 측 코드에 debounce를 추가해 해결을 시도했지만, 타이밍 불일치가 원인이었습니다.

WebView 내부에서 `window.ReactNativeWebView.postMessage()`를 사용해 ’준비 완료 신호(readyAck)’를 먼저 React Native에 보내도록 개선했습니다.

```js
// WebView 내부 초기화 코드
window.onload = () => {
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'WEBVIEW_READY' }))
}
```
React Native 측에서는 해당 메시지를 수신한 이후에만 시뮬레이션 데이터를 전달합니다

```js
onMessage = (event) => {
  const { type } = JSON.parse(event.nativeEvent.data)
  if (type === 'WEBVIEW_READY') {
    webViewRef.current.postMessage(JSON.stringify({ type: 'RENDER_PACKING', payload: { items, bag } }))
  }
}
```
이 구조를 통해 WebView가 완전히 준비된 이후에만 데이터를 전달하게 되어, 초기 렌더링 실패나 무반응 이슈가 사라졌습니다.



## 3. YOLO 감지 결과 기반 크기 추정 시 과대/과소 평가 문제

후기 이미지를 분석후 실제 가방 사이즈 추정 결과가 비정상적으로 크거나 작게 추정되는 문제가 있었습니다.

YOLOv8 모델을 활용해 이미지에서 가방과 기준 객체(A4, 손 등)를 감지하고, 픽셀 비율을 기반으로 실측 크기를 추정하는 구조를 사용했습니다. 그러나 일부 후기 이미지에서, A4가 정상적으로 인식되었음에도 가방 크기가 비현실적으로 작거나 크게 계산되는 사례가 발생했습니다.

문제는 감지된 바운딩 박스의 기준 위치와 이미지 내 여백에 있었습니다. 일부 이미지에서는 기준 객체의 바운딩 박스가 실제보다 작게 감지되거나, 여백을 포함한 박스가 가방보다 크게 잡히는 경우도 있었기 때문입니다.

이를 해결하기 위해 다음과 같은 후처리 보정 로직을 적용했습니다:
- YOLO 감지 박스에서 기준 객체가 너무 작거나 이상치로 감지된 경우 제거
- 감지된 객체 간의 상대 위치 및 비율을 기준으로 한 신뢰도 기반 필터링 적용
- 복수 기준 객체가 존재할 경우, 중앙값 기반 보정

이러한 보정을 통해 YOLO 기반 실측 추정의 정확도가 개선되었고, 과도하게 큰 또는 작은 가방 시뮬레이션이 사용자에게 제공되는 일을 방지할 수 있었습니다.

<br>

# ✨ User Experience

앱의 UI/UX설계는 **가방에 실제로 들어가는지**를 쉽게 판단할 수 있도록, <br>
시뮬레이션 기반 인터페이스와 사용자 제스처 중심으로 기능을 구현하고자 했습니다.

<br>

## 1. 메인 화면에서 바로 검색 가능하도록 구현
<p>
  <img width=300 alt="sokuri_main_readme" src=https://github.com/user-attachments/assets/51888c98-f807-4959-9602-d383cabed9e7>
</p>

- 사용자는 쇼핑몰 상품 URL만 입력하면 후기 이미지를 자동 수집하고 분석합니다.
- 기준 객체가 없는 경우를 대비해 실측 사이즈 수동 입력 기능도 제공합니다.

<br>

## 2. 정보를 카드 UI로 요약해 한눈에 파악가능
<p>
  <img width=300 alt="sokuri_main_readme" src=https://github.com/user-attachments/assets/431e434d-ff27-4a7d-abf9-17b9eb691a80>
</p>

- 분석 결과 또는 수동 입력된 가방 사이즈를 요약 카드 형태로 표시합니다.
- 사이즈는 가로 x 세로 x 높이 (cm) 단위로 표시되며, Edit 버튼을 눌러 수동 보정이 가능합니다.

<br>

## 3. 제스쳐 기반으로 아이템 변경 및 삭제

<img width="300" src="https://github.com/user-attachments/assets/8063e1da-1ac6-4abe-8214-cb4f387ad8c6" />
<img width="300" src="https://github.com/user-attachments/assets/c7ef426e-bdc0-4224-a48d-727db981bb01" />

- 아이템은 ‘이름 / 크기 / 하중’을 입력해 추가합니다.
- 추가된 아이템은 하단 리스트에 카드 형태로 표시되며, 클릭 시 선택되고 롱탭 시 사이즈를 수정할 수 있습니다.
- 아이템은 WebView 상 3D 시뮬레이터에서 바로 렌더링되며, 실시간 크기 반영이 이루어집니다.
- 현재 아이템 목록 중 하나를 스와이프 제스처로 왼쪽으로 드래그하면 '삭제하시겠습니까?'의 확인창 이후 삭제됩니다.

이러한 플로우는 웹의 입력 기반 구조와 달리, 터치 기반 환경에 맞는 조작 흐름을 구현하고자 한 결과였습니다. 특히, 드래그 & 롱탭 인터랙션을 적용하면서도 시뮬레이터와 상태의 불일치를 방지하기 위해 zustand 전역 상태 관리와 RN ↔ WebView 간 메시지 동기화 구조를 함께 설계했습니다.

모바일 앱에서는 클릭보다 손가락 제스처 기반의 조작이 훨씬 자연스럽고 빠릅니다.
이에 따라 제스처 기반으로 상호작용이 되도록 구현했습니다.

<br>


## 4. 사이즈 수정 후에도 시뮬레이터와 항상 동기화되도록 적용
<img width="300" src="https://github.com/user-attachments/assets/e2989bd6-3ab4-4091-ae5b-a05f9901496f" />

사용자는 가방이나 아이템의 크기를 언제든지 수정할 수 있어야 하고, 수정된 정보는 시뮬레이터에도 즉시 반영되어야 합니다.

-	각 아이템 카드를 약 2초 길게 누르면 사이즈 수정 모달을 호출할 수 있습니다.
-	수정된 값은 RN 상태에 저장되며, WebView로 전달되어 3D 모델이 리렌더링됩니다.
-	동일한 구조는 가방 사이즈 수정에도 적용되며, 전체 packing 영역이 자동으로 리사이징 됩니다.

이때 가장 중요했던 점은 아이템 리스트와 시뮬레이터 간의 상태 동기화 문제였습니다.
수정된 크기가 WebView에 반영되지 않거나, 반대로 WebView의 상태가 앱과 불일치할 경우 화면에 보이지 않게 됩니다.

이를 방지하기 위해 WebView로 메시지를 보낼 때는 항상 RENDER_PACKING 명령으로 전체 state를 전달하고,
수정, 삭제 등의 변경 액션은 UI와 WebView 양쪽에 동시에 적용되도록 구성했습니다.

<br>

# 🪞 Retrospective

이번 프로젝트를 통해 입력부터 시뮬레이션까지의 전체 흐름을 직접 설계하고 구현하는 경험을 쌓을 수 있었습니다. React Native 환경에서 WebView와 Three.js를 연동하여 3D 시뮬레이션을 구현하는 과정은 기술적으로 도전적이었지만, 모바일 환경에서도 유연하게 작동하는 구조를 구현할 수 있었습니다.

구현 과정에서 특히 의미 있었던 부분은, 제스처 기반 인터랙션과 실시간 상태 동기화를 직접 설계한 경험입니다. 사용자가 아이템을 추가, 수정, 삭제하는 흐름 안에서 직관적인 피드백을 제공하기 위해 다양한 제스처와 상태 전달 구조를 적용해보았습니다. 이를 바탕으로 React Native와 WebView 간 메시지 동기화를 구현하였습니다. 추후에는 피드백의 명확성과 제스처 간 반응 속도를 더욱 개선하여, 사용자 관점에서 매끄러운 흐름을 구현해보고자 합니다.

현재는 이미지 기반 분석 또는 수동 입력을 통해 가방 크기를 추정하지만, iOS 카메라를 활용해 실제 가방을 실측할 수 있다면 사용자는 더 직접적이고 정확한 정보를 얻게 될 것입니다. ARKit을 통해 실측 기반의 시뮬레이션 입력 흐름을 추가하고, 이미지가 없는 상품이나 사용자 소지품 기반 커스터마이징 기능으로 확장해보고 싶습니다.

이번 프로젝트에서는 공개된 모델을 활용해 기준 객체와 가방을 탐지했지만, 추후에는 자체 데이터셋 기반으로 모델을 학습시켜 감지 정확도를 높이는 방향을 고려하고 있습니다. 실제 사용 환경에 최적화된 모델을 구성함으로써, 보다 안정적이고 신뢰도 높은 결과를 만들어보고 싶습니다.

이번 개인 프로젝트를 통해 다양한 기술 스택을 실제로 구현해보고, 시뮬레이션 시스템에 필요한 메시지 설계와 상태 구조, 사용자 피드백 구조에 대해 구체적으로 고민할 수 있었습니다.

<br>

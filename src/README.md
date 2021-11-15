# Serperbuy:V2
serperbuy-extensions-2.x.x

```
Serperbuy:V2는 Data Labeling Tool, Superb AI Suite에 편의기능을 추가하는 Google Chrome Extension입니다.
```

## 지원정보
현재 아래의 환경만 지원합니다.
* Suite v1.10.0 이상의 Image Project

아래 환경은 지원하지 않습니다.
* Suite v1.9.9 이하의 Image, Video Project : 이 유형의 프로젝트에서는 [Serperbuy:V1](https://github.com/wonjinYi/serperbuy-extensions-1.x.x)을 사용할 수 있습니다.
* Image(deprecated) Project

## 제공기능
현재 제공하는 기능은 세 가지입니다.
#### 크기 측정기 (GinPixel)
* ``Shift + X`` 측정 크기 변경
* ``Ctrl + Shift + X`` 색상 변경(흑/백)
#### 그룹 숨김/보임 전환 (ForkLane)
* ``Shift + F`` 선택상태 진입
* ``Shift + F → 그룹명 Click`` 클릭한 그룹 내 모든 어노테이션의 숨김/보임 상태 전환
* ``Shift + F → 그룹명 이외 영역 Click`` 선택상태 취소
#### Review/Label 모드 전환 (ChookjiLaw)
* ``Shift + C`` Review Mode / Label Mode 전환
* ``Ctrl + Shift + C`` 새 탭에서 Review Mode / Label Mode 전환


## 개발내용 반영 지연 사전안내
**Superb AI Suite**에서 **Serperbuy**의 기능을 직접 지원하게 되면, 해당 기능은 **Serperbuy**에서 삭제됩니다. 
**Serperbuy** 개발자가 해당 내용 반영 후 Chrome Webstore에 등록하려면 며칠의 기간이 소요될 수 있습니다. 그 기간동안은 반드시 ``스위치``를 통해 기능을 비활성화 한 뒤 사용하시기 바랍니다.

반드시 당장 급하게 사용해야 하는 경우, Github에 공개된 소스코드를 직접 다운로드하여 Chrome에 설치하는 방법을 사용할 수도 있습니다.


## 업데이트 로그
#### 2.0.1 (2021/11/15)
* Suite의 업데이트(DOM구조 변경)에 따라 동작하지 않던 GinPixel, ForkLane을 정상동작하도록 수정했습니다.
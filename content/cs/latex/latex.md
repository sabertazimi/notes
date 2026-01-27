---
tags: [CS, LaTex]
---

# LaTeX

## Installation

- [Windows Installation Tutorial](https://liam0205.me/texlive)
- [Linux Installation Tutorial](https://stone-zeng.github.io/fduthesis/2018-05-13-install-texlive-ubuntu/)

```bash
sudo apt-get install libdigest-perl-md5-perl perl-tk
wget http://mirrors.ustc.edu.cn/CTAN/systems/texlive/Images/texlive2018.iso
sudo mount -o loop texlive2018.iso /mnt/iso
cd /mnt/iso
sudo ./install-tl -gui perltk
sudo umount /mnt/iso

export MANPATH=${MANPATH}:/usr/local/texlive/2018/texmf-dist/doc/man
export INFOPATH=${INFOPATH}:/usr/local/texlive/2018/texmf-dist/doc/info
export PATH=${PATH}:/usr/local/texlive/2018/bin/x86_64-linux
```

```bash
wget https://mirrors.tuna.tsinghua.edu.cn/CTAN/systems/texlive/tlnet/install-tl-unx.tar.gz
tar -xzf install-tl-unx.tar.gz
cd install-tl-201*
sudo apt-get install perl-tk perl-doc
sudo ./install-tl -gui -repository https://mirrors.tuna.tsinghua.edu.cn/CTAN/systems/texlive/tlnet/

sudo cp /usr/local/texlive/2018/texmf-var/fonts/conf/texlive-fontconfig.conf /etc/fonts/conf.d/09-texlive.conf
sudo fc-cache -fv

sudo tlmgr option repository https://mirrors.tuna.tsinghua.edu.cn/CTAN/systems/texlive/tlnet/
sudo tlmgr update --list
sudo tlmgr update --self --all
```

## Build Script

```makefile
filename=main

pdf:
  pdflatex -synctex=1 -shell-escape -interaction=nonstopmode ${filename}.tex
  bibtex ${filename}
  pdflatex -synctex=1 -shell-escape -interaction=nonstopmode ${filename}.tex
  pdflatex -synctex=1 -shell-escape -interaction=nonstopmode ${filename}.tex

clean:
  rm -f ${filename}.{ps,pdf,log,aux,out,dvi,bbl,blg,synctex.gz,toc,bcf,run.xml,tex.bbl,tex.blg}
  rm -f ${filename}-blx.bib
```

## Layout

```latex
\footnote{}
\emph{}
\raggedright
\centering
\raggedleft
```

### Page

```latex
\usepackage[left=1cm,right=1cm,top=2cm,bottom=3cm]{geometry}
```

### Font

```latex
\zihao{0}  % 初号
\zihao{-6} % 小六
```

## Math

### Symbol

Comprehensive LATEX symbol [list](http://tug.ctan.org/info/symbols/comprehensive/symbols-a4.pdf):

```latex
$\gamma \delta \sigma \phi \psi \rho \mu \pi$
$\sim \in$
$\geq \leq$
$\infty$
$\rightarrow$
$\surd \sqrt{2} \frac{x}{y}$
```

## Template

```latex
\usepackage{mathbbold}
\usepackage{CJK,CJKnumb}
\usepackage{indentfirst}        %首行缩进宏包
\usepackage{latexsym,bm}        % 处理数学公式中和黑斜体的宏包
\usepackage{amsmath,amssymb}    % AMSLaTeX宏包 用来排出更加漂亮的公式
\usepackage{graphicx}
\usepackage{cases}
\usepackage{pifont}
\usepackage{txfonts}

%%%%%%%%%%% CJK下设置中文字体 %%%%%%%%%%%%%
\newcommand{\song}{\CJKfamily{song}}    % 宋体   (Windows自带simsun.ttf)
\newcommand{\fs}{\CJKfamily{fs}}        % 仿宋体 (Windows自带simfs.ttf)
\newcommand{\kai}{\CJKfamily{kai}}      % 楷体   (Windows自带simkai.ttf)
\newcommand{\hei}{\CJKfamily{hei}}      % 黑体   (Windows自带simhei.ttf)
\newcommand{\li}{\CJKfamily{li}}        % 隶书   (Windows自带simli.ttf)

%%%%%%%%%%%  设置字体大小 %%%%%%%%%%%%%
\newcommand{\chuhao}{\fontsize{42pt}{\baselineskip}\selectfont}
\newcommand{\xiaochuhao}{\fontsize{36pt}{\baselineskip}\selectfont}
\newcommand{\yihao}{\fontsize{28pt}{\baselineskip}\selectfont}
\newcommand{\erhao}{\fontsize{21pt}{\baselineskip}\selectfont}
\newcommand{\xiaoerhao}{\fontsize{18pt}{\baselineskip}\selectfont}
\newcommand{\sanhao}{\fontsize{15.75pt}{\baselineskip}\selectfont}
\newcommand{\sihao}{\fontsize{14pt}{\baselineskip}\selectfont}
\newcommand{\xiaosihao}{\fontsize{12pt}{\baselineskip}\selectfont}
\newcommand{\wuhao}{\fontsize{10.5pt}{\baselineskip}\selectfont}
\newcommand{\xiaowuhao}{\fontsize{9pt}{\baselineskip}\selectfont}
\newcommand{\liuhao}{\fontsize{7.875pt}{\baselineskip}\selectfont}
\newcommand{\qihao}{\fontsize{5.25pt}{\baselineskip}\selectfont}

%%%%%%%% 设置版心 %%%%%%%%%%%%%
\setlength{\textwidth}{14cm}
\setlength{\textheight}{20cm}
\setlength{\hoffset}{0cm}
\setlength{\voffset}{0cm}
\setlength{\parindent}{2em}                 % 首行两个汉字的缩进量
\setlength{\parskip}{3pt plus1pt minus1pt} % 段落之间的竖直距离
\renewcommand{\baselinestretch}{1.2}        % 定义行距
\setlength{\abovedisplayskip}{2pt plus1pt minus1pt}     %公式前的距离
\setlength{\belowdisplayskip}{6pt plus1pt minus1pt}     %公式后面的距离
\setlength{\arraycolsep}{2pt}   %在一个array中列之间的空白长度, 因为原来的太宽了

\allowdisplaybreaks[4] % \eqnarray如果很长，影响分栏、换行和分页
                        %（整块挪动，造成页面空白），可以设置成为自动调整模式

\CJKtilde   %用于解决英文字母和汉字的间距问题。例如：变量~$x$~的值。
\renewcommand{\CJKglue}{\hskip 0pt plus 0.08\baselineskip}
%它于必要时在汉字之间插入一个附加的空隙，以解决行的超长问题。

%\numberwithin{equation}{section}

%================= 一些自定义命令 =============%
\newcommand{\R}{\ensuremath{\mathbb{R}}}
\newcommand{\p}{\partial}
\newcommand{\g}{\gamma}
%=================== End ======================%

\usepackage{fancyhdr}
\pagestyle{fancy}
\renewcommand{\headrulewidth}{0.6pt}
%\addtolength{\parinddent}{2em plus 1em minus 1em]

%===============标题名称中文化 ===================%
\renewcommand\abstractname{\hei 摘\ 要}
\renewcommand\refname{\hei 参考文献}
\renewcommand\figurename{\hei 图}
\renewcommand\tablename{\hei 表}
\newtheorem{dingyi}{\hei 定义~}[section]
\newtheorem{dingli}{\hei 定理~}[section]
\newtheorem{yinli}[dingli]{\hei 引理~}
\newtheorem{tuilun}[dingli]{\hei 推论~}
\newtheorem{mingti}[dingli]{\hei 命题~}

%% 注：在印刷出版上，中文字号制与点数制的对照关系如下：
%% 1770年法国人狄道（F.A.Didot）制定点数制，规定1法寸为72点，即：1点=0.3759毫米。
%% 狄道点数制在法国、德国、奥地利、比利时、丹麦、匈牙利等国比较流行。
%% 1886年全美活字铸造协会以派卡（pica）为基准制定派卡点数制，规定1pica=12point（点），即：
%% 1点=0.013837英寸=0.35146毫米
%% 20世纪初派卡点数制传入我国，并得到逐步推广。在实用中对常用点数以号数命名而产生了号数制，
%% 二者换算如下（以pt代表“点”）：
%% 初号……42pt   小初号……36pt    一号……28pt     二号……21pt    小二号……18pt   三号……15.75pt
%% 四号……14pt   小四号……12pt    五号……10.5pt   小五号……9pt   六号 …… 7.875pt  七号 …… 5.25pt

%%%%% xeCJK下设置中文字体 %%%%%%%%%%%
\setCJKfamilyfont{song}{SimSun}                                 %宋体 song
\newcommand{\song}{\CJKfamily{song}}
\setCJKfamilyfont{xs}{NSimSun}                            %新宋体 xs
\newcommand{\xs}{\CJKfamily{xs}}
\setCJKfamilyfont{fs}{FangSong_GB2312}        %仿宋2312 fs
\newcommand{\fs}{\CJKfamily{fs}}
\setCJKfamilyfont{kai}{KaiTi_GB2312}                        %楷体2312  kai
\newcommand{\kai}{\CJKfamily{kai}}
\setCJKfamilyfont{yh}{Microsoft YaHei}                    %微软雅黑 yh
\newcommand{\yh}{\CJKfamily{yh}}
\setCJKfamilyfont{hei}{SimHei}                                    %黑体  hei
\newcommand{\hei}{\CJKfamily{hei}}
\setCJKfamilyfont{msunicode}{Arial Unicode MS}            %Arial Unicode MS: msunicode
\newcommand{\msunicode}{\CJKfamily{msunicode}}
\setCJKfamilyfont{li}{LiSu}                                            %隶书  li
\newcommand{\li}{\CJKfamily{li}}
\setCJKfamilyfont{yy}{YouYuan}                             %幼圆  yy
\newcommand{\yy}{\CJKfamily{yy}}
\setCJKfamilyfont{xm}{MingLiU}                                        %细明体  xm
\newcommand{\xm}{\CJKfamily{xm}}
\setCJKfamilyfont{xxm}{PMingLiU}                             %新细明体  xxm
\newcommand{\xxm}{\CJKfamily{xxm}}
\setCJKfamilyfont{hwsong}{STSong}                            %华文宋体  hwsong
\newcommand{\hwsong}{\CJKfamily{hwsong}}
\setCJKfamilyfont{hwzs}{STZhongsong}                        %华文中宋  hwzs
\newcommand{\hwzs}{\CJKfamily{hwzs}}
\setCJKfamilyfont{hwfs}{STFangsong}                            %华文仿宋  hwfs
\newcommand{\hwfs}{\CJKfamily{hwfs}}
\setCJKfamilyfont{hwxh}{STXihei}                                %华文细黑  hwxh
\newcommand{\hwxh}{\CJKfamily{hwxh}}
\setCJKfamilyfont{hwl}{STLiti}                                        %华文隶书  hwl
\newcommand{\hwl}{\CJKfamily{hwl}j
\setCJKfamilyfont{hwxw}{STXinwei}                                %华文新魏  hwxw
\newcommand{\hwxw}{\CJKfamily{hwxw}}
\setCJKfamilyfont{hwk}{STKaiti}                                    %华文楷体  hwk
\newcommand{\hwk}{\CJKfamily{hwk}}
\setCJKfamilyfont{hwxk}{STXingkai}                            %华文行楷  hwxk
\newcommand{\hwxk}{\CJKfamily{hwxk}}
\setCJKfamilyfont{hwcy}{STCaiyun}                                 %华文彩云 hwcy
\newcommand{\hwcy}{\CJKfamily{hwcy}}
\setCJKfamilyfont{hwhp}{STHupo}                                 %华文琥珀   hwhp
\newcommand{\hwhp}{\CJKfamily{hwhp}}
\setCJKfamilyfont{fzsong}{Simsun (Founder Extended)}     %方正宋体超大字符集   fzsong
\newcommand{\fzsong}{\CJKfamily{fzsong}}
\setCJKfamilyfont{fzyao}{FZYaoTi}                                    %方正姚体  fzy
\newcommand{\fzyao}{\CJKfamily{fzyao}}
\setCJKfamilyfont{fzshu}{FZShuTi}                                    %方正舒体 fzshu
\newcommand{\fzshu}{\CJKfamily{fzshu}}
\setCJKfamilyfont{asong}{Adobe Song Std}                        %Adobe 宋体  asong
\newcommand{\asong}{\CJKfamily{asong}}
\setCJKfamilyfont{ahei}{Adobe Heiti Std}                            %Adobe 黑体  ahei
\newcommand{\ahei}{\CJKfamily{ahei}}
\setCJKfamilyfont{akai}{Adobe Kaiti Std}                            %Adobe 楷体  akai
\newcommand{\akai}{\CJKfamily{akai}}
```

## Toolchain

### PDF to Tex

```bash
sudo apt install abiword
abiword --to=tex a.pdf
```

### Tlmgr

```bash
sudo apt-get install xzdec
cd ~
mkdir texmf
tlmgr init-usertree
tlmgr install <package>
```

```bash
tlmgr update --self --all
tlmgr update --list
```

## References

- Simple LaTeX [introduction](https://liam0205.me/2014/09/08/latex-introduction).
- HaiYang Liu's LaTeX [tutorial](https://yun.weicheng.men/Book/LaTeX%E5%85%A5%E9%97%A8.pdf).
- Paper [best practices](https://github.com/Wookai/paper-tips-and-tricks).
- LaTeX [equations](http://moser-isi.ethz.ch/docs/typeset_equations.pdf).

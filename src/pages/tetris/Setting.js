import React, { useEffect, useState, useContext, useRef } from 'react';
import Panel from '../../component/Panel';
import { UT } from '../../util/util';
import {SessionContext} from '../../App';

function Setting({onBack}){
    const [keys, setKeys] = useState([]);
    const ref_theme_col = useRef("");
    const ref_keybox = useRef();
    const ref_theme = useRef();
    const ref_init_theme = useRef("");
    const context = useContext(SessionContext);
    const selected = "key-btn-sel";

    const onClick = (e)=>{
        const targ = e.currentTarget;
        const idx = targ.id.indexOf("theme");
        const node = idx === -1 ? ref_keybox.current : ref_theme.current;
        const sel = node.querySelector(`.${selected}`);
        
        if(sel){
            if(idx === -1){
                sel.classList.toggle(selected);
                if(sel.id !== targ.id) targ.classList.toggle(selected);
            }else{
                if(sel.id !== targ.id) {
                    targ.classList.add(selected);
                    sel.classList.remove(selected)
                }
            }
        }else{
            targ.classList.toggle(selected);
        }

        if(idx > -1){
            const root = document.querySelector('#root');
            if(targ.id === "theme2"){
                root.classList.add("dark");
                ref_theme_col.current = "dark";
            }else{
                root.classList.remove("dark");
                ref_theme_col.current = "";
            }
            context.onChangeTheme(ref_theme_col.current);
        }
    }
    const onKeyDown = (e)=>{
        const targ = ref_keybox.current.querySelector(`.${selected}`);
        if(targ && targ.classList.contains(selected)){
            const idx = Number(targ.id.split('key')[1]);
            setKeys(pre => {
                pre[idx] = e.key;
                return pre.slice();
            });
        }
    }
    const getKeyset = ()=>{
        const param = {
            url : "getKeySet",
            body : {name : context.session.id}
        };
        UT.request(param, (res)=>{
            var keyset = res.result[0] && res.result[0].keyset;
            const arr = keyset ? keyset.split('/') : ['w','s','a','d','j'];
            setKeys(arr);
        });
    }
    const saveKeyset = ()=>{
        UT.confirm("Do you want to save?", ()=>{
            const param = {
                url : "saveKeySet",
                body : {
                    name : context.session.id,
                    keyset : keys.join('/')
                }
            } 
            UT.request(param, (res)=>{
                UT.alert(res.errMsg || "Save complete!");
            });
        });
    }
    const getTheme = ()=>{
        const param = {
            url : "getTheme",
            body : {name : context.session.id}
        };
        UT.request(param, (res)=>{
            const targ = res.result[0] && res.result[0].theme === "dark" ? "theme2" : "theme1";
            ref_theme.current.querySelector(`#${targ}`).classList.add(selected);
            ref_theme_col.current = res.result[0] ? res.result[0].theme : "light";
            ref_init_theme.current = res.result[0] ? res.result[0].theme : "light";
        });
    }
    const saveTheme = ()=>{
        UT.confirm("Do you want to save?", ()=>{
            const param = {
                url : "saveTheme",
                body : {
                    name : context.session.id,
                    theme : ref_theme_col.current
                }
            } 
            UT.request(param, (res)=>{
                UT.alert(res.errMsg || "Save complete!", ()=>{
                    getTheme();
                });
            });
        });
    }
    const restoreKeyset = ()=>{
        setKeys(['w','s','a','d','j']);
    }
    const onBackClick = ()=>{
        context.onChangeTheme(ref_init_theme.current);
        onBack();
    }

    useEffect(()=>{
        getKeyset();
        getTheme();
        document.addEventListener("keydown", onKeyDown);
        return ()=> document.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <>  
            <div className="setting-box">
                <Panel title="Key Setting" style={{height : "280px", marginBottom : "20px"}}>
                    <div className="keyset-box" ref={ref_keybox}>
                        <div>Rotate
                            <div className="key-btn" id="key0" onClick={onClick}>{keys[0]}</div>
                        </div>
                        <div>Move down
                            <div className="key-btn" id="key1" onClick={onClick}>{keys[1]}</div>
                        </div>
                        <div>Move left
                            <div className="key-btn" id="key2" onClick={onClick}>{keys[2]}</div>
                        </div>
                        <div>Move right
                            <div className="key-btn" id="key3" onClick={onClick}>{keys[3]}</div>
                        </div>
                        <div>Drop
                            <div className="key-btn" id="key4" onClick={onClick}>{keys[4]}</div>
                        </div>
                    </div>
                    <div className="setting-btn">
                        <div className="basic-btn-3" onClick={saveKeyset}>Save</div>
                        <div className="basic-btn-3" onClick={restoreKeyset}>Restore Default</div>
                    </div>
                </Panel>
                <Panel title="Theme Color" style={{height : "150px"}}>
                    <div className="x-center" ref={ref_theme} style={{display : "flex", width : "fit-content"}}>
                        <div className="basic-btn-3" id="theme1" onClick={onClick}>Light</div>
                        <div className="basic-btn-3" id="theme2" onClick={onClick}>Dark</div>
                    </div>
                    <div className="setting-btn">
                        <div className="basic-btn-3" onClick={saveTheme}>Save</div>
                    </div>
                </Panel>
            </div>
            <div className="label1" onClick={onBackClick}>Back</div>
        </>
    );
}

export default Setting;
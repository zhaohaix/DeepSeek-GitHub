import React,{useState} from 'react';
import{repositoryNameHint,repositoryNameError}from'./repository-name.mjs';
export function RepositoryNameField({action}){
 const [error,setError]=useState('');
 const validate=e=>{const message=repositoryNameError(e.currentTarget.value);e.currentTarget.setCustomValidity(message);setError(message);};
 return <div className="gh-field"><div className="gh-ai-label"><label htmlFor="gh-repository-name">仓库名称</label>{action}</div><input id="gh-repository-name" name="name" required maxLength={100} placeholder="my-project" aria-describedby={error?'gh-repository-name-hint gh-repository-name-error':'gh-repository-name-hint'} aria-invalid={!!error} onChange={validate} onInvalid={validate}/><small id="gh-repository-name-hint" className="gh-muted">{repositoryNameHint}</small>{error&&<small id="gh-repository-name-error" className="gh-error" role="alert">{error}</small>}</div>;
}

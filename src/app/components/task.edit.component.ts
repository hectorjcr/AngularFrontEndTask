import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task';

@Component({
	selector: 'task-edit',
	templateUrl: '../views/task.new.html',
	providers:[
		UserService,
		TaskService
	]
})

export class TaskEditComponent implements OnInit{
	public page_title: string;
	public identity;
	public token;
	public task: Task;
	public status;
	public loading;

	constructor(
		private _userService: UserService,
		private _taskService: TaskService,
		private _route: ActivatedRoute,
		private _router: Router
		){
		this.page_title = 'Modificar tarea';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}

	ngOnInit(){
		if(this.identity == null && !this.identity.sub){
			this._router.navigate(['/login']);
		}else{
			//this.task = new Task(1,'','','new','null','null');
			this.getTask();
		}		
	}

	getTask(){
		this.loading = 'show';
		this._route.params.forEach((params: Params)=>{
			let id = +params['id'];

			this._taskService.getTask(this.token, id).subscribe(
				response =>{					
					if(response.status == 'success'){
						if(response.data.user.id == this.identity.sub){
							this.task = response.data;
							this.loading = 'hide';
						}else{
							this._router.navigate(['/']);
						}
						
					}else{
						this._router.navigate(['/login'])
					}
				},
				error => {
					console.log(<any>error);
				}
			);
		});
	}

	onSubmit(){
		console.log(this.task);
		this._route.params.forEach((params: Params)=>{
			let id = +params['id'];
			this._taskService.update(this.token, this.task, id).subscribe(
				response =>{
					console.log(response);
					this.status = response.status;
					if(this.status != 'success'){
						this.status = 'error';
					}else{
						this.task = response.data;
					}
				},
				error => {
					console.log(<any>error);
				}
				);
		});

	}
}
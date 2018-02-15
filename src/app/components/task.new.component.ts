import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task';

@Component({
	selector: 'task-new',
	templateUrl: '../views/task.new.html',
	providers:[
		UserService,
		TaskService
	]
})

export class TaskNewComponent implements OnInit{
	public page_title: string;
	public identity;
	public token;
	public task: Task;
	public status;

	constructor(
		private _userService: UserService,
		private _taskService: TaskService,
		private _route: ActivatedRoute,
		private _router: Router
		){
		this.page_title = 'Crear nueva tarea';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}

	ngOnInit(){
		if(this.identity == null && !this.identity.sub){
			this._router.navigate(['/login']);
		}else{
			this.task = new Task(1,'','','new','null','null');
		}		
	}
	onSubmit(){
		console.log(this.task);
		console.log(this.token);

		this._taskService.create(this.token, this.task).subscribe(
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

	}
}